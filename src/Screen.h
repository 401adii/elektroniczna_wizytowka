#pragma once
#include <vector>
#include <functional>
#include <algorithm>

class Screen {
public:
    static std::vector<Screen> Screens;
    static std::vector<Screen*> ActiveScreens;
    static size_t activeScreenIndex;
    
    uint8_t ID;
    bool active;
    std::function<void()> printFunction;

    Screen(uint8_t ID, bool active, std::function<void()> printFunction);
    
    static void SetActive(uint8_t ID);
    static void SetInactive(uint8_t ID);
    static void Next();
    static void Previous();
    void Print() const;
    static void PrintActive();
};