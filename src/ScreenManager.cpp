#include "ScreenManager.h"

using DrawFunction = std::function<void()>;
std::unordered_map<int, DrawFunction> screens;
std::vector<int> activeScreens;
int currentScreen = -1;

void ScreenManager::addScreen(int id, DrawFunction drawFunc) {
    if (screens.find(id) == screens.end()) {
        screens[id] = drawFunc;
        activeScreens.push_back(id);
    } else {
        std::cerr << "Screen with ID " << id << " already exists." << std::endl;
    }
}

void ScreenManager::removeScreen(int id) {
  auto it = screens.find(id);
    if (it != screens.end()) {
        auto iter = std::find(activeScreens.begin(), activeScreens.end(), id);
        if (iter != activeScreens.end()) {
            activeScreens.erase(iter);
        } else {
            std::cerr << "Screen with ID " << id << " does not exist in the active screens list." << std::endl;
        }
        screens.erase(it);
    } else {
        std::cerr << "Screen with ID " << id << " does not exist." << std::endl;
    }
}

void ScreenManager::setActiveScreen(int id) {
    auto it = screens.find(id);
    if (it != screens.end()) {
        currentScreen = id;
    } else {
        std::cerr << "Screen with ID " << id << " does not exist." << std::endl;
    }
}

void ScreenManager::nextScreen() {
    if (!activeScreens.empty()) {
        auto it = std::find(activeScreens.begin(), activeScreens.end(), currentScreen);
        if (it != activeScreens.end() && ++it != activeScreens.end()) {
            currentScreen = *it;
        } else {
            currentScreen = activeScreens.front();
        }
    } else {
        std::cerr << "No active screens to move to the next screen." << std::endl;
    }
}

void ScreenManager::prevScreen() {
    if (!activeScreens.empty()) {
        auto it = std::find(activeScreens.begin(), activeScreens.end(), currentScreen);
        if (it != activeScreens.end() && --it != activeScreens.end()) {
            currentScreen = *it;
        } else {
            currentScreen = activeScreens.back();
        }
    } else {
        std::cerr << "No active screens to move to the previous screen." << std::endl;
    }
}

void ScreenManager::printCurrentScreen() const {
    auto it = screens.find(currentScreen);
    if (it != screens.end()) {
        it->second();
    } else {
        std::cerr << "No current screen to print." << std::endl;
    }
}