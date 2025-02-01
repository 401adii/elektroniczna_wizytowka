#pragma once
#include <iostream>
#include <vector>
#include <unordered_map>
#include <functional>
#include <algorithm>
#include <Preferences.h>

class ScreenManager {
public:
    using DrawFunction = std::function<void()>;

    void addScreen(int id, DrawFunction drawFunc);
    void removeScreen(int id);
    void setCurrentScreen(int id);
    void nextScreen();
    void prevScreen();
    void printCurrentScreen() const;
    void saveScreens(Preferences &data, const char* name) const;
    void readAndSetActiveScreens(Preferences &data, const char* name);

private:
    std::unordered_map<int, DrawFunction> screens;
    std::vector<int> activeScreens;
    int currentScreen = -1;
};