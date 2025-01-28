#pragma once
#include <bits/stdc++.h>

class Screen
{
public:
    uint8_t ID;
    bool active;
    std::function<void()> printFunction;
    Screen(uint8_t ID, bool active, std::function<void()>printFunction);
    void Print();
};
