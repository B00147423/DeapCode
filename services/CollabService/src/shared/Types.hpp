// ===================== Types.hpp =====================
#pragma once
#include <string>
#include <unordered_map>
#include <vector>
#include <nlohmann/json.hpp>
enum class MessageType {
    JOIN,
    LEAVE,
    CODE_EDIT,
    CHAT,
    CODE_EDIT,
    RUN_CODE,
};

struct Message {
    MessageType type;
    std::string userId;
    std::string username;
    std::string roomId;
    std::string content;
};

// Define the PerSocketData struct used by uWebSockets
struct PerSocketData {
    std::string userId;
    std::string username;
    std::string roomId;
};

inline void to_json(nlohmann::json& j, const Message& m) {
    j = {
        {"type", static_cast<int>(m.type)},
        {"userId", m.userId},
        {"username", m.username},
        {"roomId", m.roomId},
        {"content", m.content}
    };
}