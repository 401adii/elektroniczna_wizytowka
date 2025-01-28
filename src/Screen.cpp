#include <bits/stdc++.h>
#include "Screen.h"

Screen::Screen(uint8_t ID, bool active, std::function<void()> printFunction){
    Screen::ID = ID;
    Screen::active = active;
    Screen::printFunction = printFunction;
}

void Screen::Print(){
    printFunction();
}