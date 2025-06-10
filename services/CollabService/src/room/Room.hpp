// ===================== Room.hpp =====================
#pragma once
#include "../src/shared/Types.hpp"
#include <uwebsockets/App.h> 
#include <unordered_map>
#include <string>

class Room {

public:
    Room(const std::string& id);
    void addClient(const std::string& userId, uWS::WebSocket<false, true, PerSocketData>* ws);
    void removeClient(const std::string& userId);
    void broadcast(const Message& message, const std::string& excludeUserId = "");
    bool isEmpty() const;

    bool hasClient(const std::string& userId) const {
        return clients.find(userId) != clients.end();
    }
private:
    std::string id;
    std::unordered_map<std::string, uWS::WebSocket<false, true, PerSocketData>*> clients;
};
