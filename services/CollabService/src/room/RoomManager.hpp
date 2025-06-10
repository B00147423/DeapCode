// ===================== RoomManager.hpp =====================
#pragma once
#include "Room.hpp"
#include <unordered_map>
#include <string>

class RoomManager {
public:
    Room* getOrCreateRoom(const std::string& roomId);
    void removeRoomIfEmpty(const std::string& roomId);
    
    // Global user tracking methods
    bool isUserInAnyRoom(const std::string& userId);
    std::string getUserCurrentRoom(const std::string& userId);
    void addUserToRoom(const std::string& userId, const std::string& roomId);
    void removeUserFromRoom(const std::string& userId);
    
private:
    std::unordered_map<std::string, Room*> rooms;
    // Global user tracking: userId -> roomId
    std::unordered_map<std::string, std::string> userToRoom;
};
