// ===================== Room.cpp =====================
#include "Room.hpp"
#include <iostream>
#include <nlohmann/json.hpp>

Room::Room(const std::string& id) : id(id) {}

void Room::addClient(const std::string& userId, uWS::WebSocket<false, true, PerSocketData>* ws) {
    clients[userId] = ws;
    std::cout << userId << " joined room " << id << "\n";
}

void Room::removeClient(const std::string& userId) {
    clients.erase(userId);
    std::cout << userId << " left room " << id << "\n";
}
void Room::broadcast(const Message& message, const std::string& excludeUserId) {
    nlohmann::json j = {
        {"type", static_cast<int>(message.type)},
        {"userId", message.userId},
        {"username", message.username},
        {"roomId", message.roomId},
        {"content", message.content}
    };

    std::string payload = j.dump();

    for (auto& [uid, ws] : clients) {
        if (uid != excludeUserId) {
            ws->send(payload, uWS::OpCode::TEXT);
        }
    }
}

bool Room::isEmpty() const {
    return clients.empty();
}