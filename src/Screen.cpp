#include "Screen.h"

// Initialize static members
std::vector<Screen> Screen::Screens;
std::vector<Screen*> Screen::ActiveScreens;
size_t Screen::activeScreenIndex = 0;

Screen::Screen(uint8_t ID, bool active, std::function<void()> printFunction)
    : ID(ID), active(active), printFunction(printFunction) {
    Screens.push_back(*this);
    if(active){
        ActiveScreens.push_back(this);
    }
}

void Screen::SetActive(uint8_t ID) {
    auto it = std::find_if(Screens.begin(), Screens.end(),
        [ID](const Screen& s) { return s.ID == ID; });
    
    if (it != Screens.end()) {
        it->active = true;
        auto activeIt = std::find(ActiveScreens.begin(), ActiveScreens.end(), &(*it));
        if (activeIt == ActiveScreens.end()) {
            ActiveScreens.push_back(&(*it));
        }
    }
}

void Screen::SetInactive(uint8_t ID) {
    auto it = std::find_if(Screens.begin(), Screens.end(),
        [ID](const Screen& s) { return s.ID == ID; });
    
    if (it != Screens.end()) {
        it->active = false;
        ActiveScreens.erase(
            std::remove_if(ActiveScreens.begin(), ActiveScreens.end(),
                [ID](Screen* s) { return s->ID == ID; }),
            ActiveScreens.end());
    }
}

void Screen::Next() {
    if (!ActiveScreens.empty()) {
        activeScreenIndex = (activeScreenIndex + 1) % ActiveScreens.size();
    }
}

void Screen::Previous() {
    if (!ActiveScreens.empty()) {
        activeScreenIndex = (activeScreenIndex == 0) 
            ? ActiveScreens.size() - 1 
            : activeScreenIndex - 1;
    }
}

void Screen::Print() const {
    if (printFunction) {
        printFunction();
    }
}

void Screen::PrintActive() {
    if (!ActiveScreens.empty() && activeScreenIndex < ActiveScreens.size()) {
        ActiveScreens[activeScreenIndex]->Print();
    }
}