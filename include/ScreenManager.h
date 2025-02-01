#pragma once
#include <iostream>
#include <vector>
#include <unordered_map>
#include <functional>
#include <algorithm>

class ScreenManager {
public:
    using DrawFunction = std::function<void()>;

    void addScreen(int id, DrawFunction drawFunc);
    void removeScreen(int id);
    void setActiveScreen(int id);
    void nextScreen();
    void prevScreen();
    void printCurrentScreen() const;

private:
    std::unordered_map<int, DrawFunction> screens;
    std::vector<int> activeScreens;
    int currentScreen = -1;
};