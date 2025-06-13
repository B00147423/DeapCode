// WebSocketHandlers.cpp
#include "WebSocketHandlers.hpp"
#include "../room/RoomManager.hpp"
#include "../shared/Types.hpp"
#include <nlohmann/json.hpp>
#include "../codeSolutions/codeSolutions.hpp"

extern RoomManager roomManager;  // declared in main.cpp

void handleMessage(uWS::WebSocket<false, true, PerSocketData>* ws, std::string_view msg) {
    using json = nlohmann::json;
    json j = json::parse(msg);

    Message message;
    message.type = static_cast<MessageType>(j["type"].get<int>());
    message.userId = j["userId"];
    message.username = j.contains("username") ? j["username"] : j["userId"]; // Fallback to userId if no username
    message.roomId = j["roomId"];
    message.content = j["content"];

    // Attach user and room info to connection
    ws->getUserData()->userId = message.userId;
    ws->getUserData()->username = message.username;
    ws->getUserData()->roomId = message.roomId;

    Room* room = roomManager.getOrCreateRoom(message.roomId);

    switch (message.type) {
    case MessageType::JOIN:
        {
            // Check if user is already in this specific room
            if (room->hasClient(message.userId)) {
                ws->send(nlohmann::json({
                    {"type", static_cast<int>(MessageType::CHAT)},
                    {"userId", "System"},
                    {"username", "System"},
                    {"roomId", message.roomId},
                    {"content", "You're already connected to this room from another tab or device."}
                    }).dump(), uWS::OpCode::TEXT);
                ws->close();
                break;
            }
            
            // Check if user is in ANY other room (NEW GLOBAL CHECK)
            if (roomManager.isUserInAnyRoom(message.userId)) {
                std::string currentRoomId = roomManager.getUserCurrentRoom(message.userId);
                ws->send(nlohmann::json({
                    {"type", static_cast<int>(MessageType::CHAT)},
                    {"userId", "System"},
                    {"username", "System"},
                    {"roomId", message.roomId},
                    {"content", "You're already connected to another room (" + currentRoomId + "). Please leave that room first before joining a new one."}
                    }).dump(), uWS::OpCode::TEXT);
                ws->close();
                break;
            }
            
            // All checks passed - add user to room and global tracking
            room->addClient(message.userId, ws);
            roomManager.addUserToRoom(message.userId, message.roomId);
            
            room->broadcast({
                MessageType::CHAT,
                "System",
                "System",
                message.roomId,
                message.username + " joined the room."
                });
            break;
        }

    case MessageType::LEAVE:
        room->removeClient(message.userId);
        roomManager.removeUserFromRoom(message.userId); // Remove from global tracking
        room->broadcast({
            MessageType::CHAT,
            "System",
            "System",
            message.roomId,
            message.username + " left the room."
            }, "");
        roomManager.removeRoomIfEmpty(message.roomId);
        break;

    case MessageType::CHAT:
    case MessageType::CODE_EDIT:
        room->broadcast(message, message.userId); // Don't echo back
        break;
    case MessageType::RUN_CODE: {
        nlohmann::json codeReq = nlohmann::json::parse(message.content);
        std::string code = codeReq.value("code", "");
        std::string languageGroup = codeReq.value("language", "cpp");
        // Optional: std::string input = codeReq.value("input", "");

        std::string result = codeSolutions(code, languageGroup);

        ws->send(nlohmann::json({
            {"type", static_cast<int>(MessageType::RUN_CODE)},
            {"userId", message.userId},
            {"username", message.username},
            {"roomId", message.roomId},
            {"content", result}
            }).dump(), uWS::OpCode::TEXT);
        break;
    }

    default:
        std::cerr << "Unknown message type\n";
    }
}

void handleClose(uWS::WebSocket<false, true, PerSocketData>* ws) {
    std::string userId = ws->getUserData()->userId;
    std::string username = ws->getUserData()->username;
    std::string roomId = ws->getUserData()->roomId;
    
    if (!userId.empty() && !roomId.empty()) {
        Room* room = roomManager.getOrCreateRoom(roomId);
        room->removeClient(userId);
        roomManager.removeUserFromRoom(userId); // Remove from global tracking

        room->broadcast({
            MessageType::CHAT,
            "System",
            "System",
            roomId,
            username + " left the room."
            });

        roomManager.removeRoomIfEmpty(roomId);
    }
}