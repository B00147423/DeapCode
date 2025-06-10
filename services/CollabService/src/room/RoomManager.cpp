// ===================== RoomManager.cpp =====================
#include "RoomManager.hpp"

Room* RoomManager::getOrCreateRoom(const std::string& roomId) {
    if (rooms.find(roomId) == rooms.end()) {
        rooms[roomId] = new Room(roomId);
    }
    return rooms[roomId];
}

void RoomManager::removeRoomIfEmpty(const std::string& roomId) {
    auto it = rooms.find(roomId);
    if (it != rooms.end() && it->second->isEmpty()) {
        delete it->second;
        rooms.erase(it);
    }
}

// Global user tracking implementations
bool RoomManager::isUserInAnyRoom(const std::string& userId) {
    return userToRoom.find(userId) != userToRoom.end();
}

std::string RoomManager::getUserCurrentRoom(const std::string& userId) {
    auto it = userToRoom.find(userId);
    return (it != userToRoom.end()) ? it->second : "";
}

void RoomManager::addUserToRoom(const std::string& userId, const std::string& roomId) {
    userToRoom[userId] = roomId;
}

void RoomManager::removeUserFromRoom(const std::string& userId) {
    userToRoom.erase(userId);
}
