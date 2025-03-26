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

    enum class Status{
        OK, //No error
        RepetedID, //Screen with that ID already exists!
        DoesntExist, //Screen with that ID does not exist!
        NoActiveScreens, //No active screens!
        CurrentNotActive, //Current screen is not active!
    };

    Status addScreen(int id, DrawFunction drawFunc);
    Status removeScreen(int id);
    Status nextScreen();
    Status prevScreen();
    Status printCurrentScreen() const;
    void readAndSetActiveScreens(Preferences &data, const char* name);
    

    private:
    std::unordered_map<int, DrawFunction> screens;
    std::vector<int> activeScreens;
    int currentScreen = -1;
    
    void saveScreens(Preferences &data, const char* name) const;
    Status setCurrentScreen(int id);
};