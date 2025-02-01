#include "ScreenManager.h"

using DrawFunction = std::function<void()>;
std::unordered_map<int, DrawFunction> screens;
std::vector<int> activeScreens;
int currentScreen = -1;

void ScreenManager::addScreen(int id, DrawFunction drawFunc) {
    if (screens.find(id) == screens.end()) {
        screens[id] = drawFunc;
    } else {
        std::cout << "Screen with ID " << id << " already exists." << std::endl;
    }
}

void ScreenManager::removeScreen(int id) {
  auto it = screens.find(id);
    if (it != screens.end()) {
        auto iter = std::find(activeScreens.begin(), activeScreens.end(), id);
        if (iter != activeScreens.end()) {
            activeScreens.erase(iter);
        } else {
            std::cout << "Screen with ID " << id << " does not exist in the active screens list." << std::endl;
        }
        screens.erase(it);
    } else {
        std::cout << "Screen with ID " << id << " does not exist." << std::endl;
    }
}

void ScreenManager::setCurrentScreen(int id) {
    auto it = screens.find(id);
    if (it != screens.end()) {
        currentScreen = id;
    } else {
        std::cout << "Screen with ID " << id << " does not exist." << std::endl;
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
        std::cout << "No active screens to move to the next screen." << std::endl;
    }
}

void ScreenManager::prevScreen() {
    if (!activeScreens.empty()) {
        auto it = std::find(activeScreens.begin(), activeScreens.end(), currentScreen);
        if (it != activeScreens.end()) {
            if (it != activeScreens.begin()) {
                --it;
                currentScreen = *it;
            } else {
                currentScreen = activeScreens.back();
            }
        } else {
            std::cout << "Current screen not found in active screens." << std::endl;
        }
    } else {
        std::cout << "No active screens to move to the previous screen." << std::endl;
    }
}

void ScreenManager::printCurrentScreen() const {
    if (std::find(activeScreens.begin(), activeScreens.end(), currentScreen) != activeScreens.end()) {
        screens.find(currentScreen)->second();
    } else {
        std::cout << "No current screen to print. Current screen: " << currentScreen << std::endl;
    }
}

void ScreenManager::saveScreens(Preferences &data, const char* name) const{
    data.begin(name, false);

    for (auto it = screens.begin(); it != screens.end(); it++){
        int id = it->first;
        auto iter = std::find(activeScreens.begin(), activeScreens.end(), id);
        if (iter != activeScreens.end()){
            data.putBool(std::to_string(id).c_str(), true);
            std::cout << "[NVS] Saved data: " << id << " = true" << std::endl;
        } else {
            data.putBool(std::to_string(id).c_str(), false);
            std::cout << "[NVS] Saved data: " << id << " = false" << std::endl;
        }
    }
    data.end();
}

void ScreenManager::readAndSetActiveScreens(Preferences &data, const char* name){
    data.begin(name, true);
    activeScreens.clear();
    for (auto it = screens.begin(); it != screens.end(); it++){
        int id = it->first;
        String value = data.getString(std::to_string(id).c_str(), "0");
        if (value == "1"){
            activeScreens.push_back(id);
            ScreenManager::setCurrentScreen(id);
            std::cout << "[NVS] Read data: " << id << " = true" << std::endl;
        }
    }
    data.end();

    std::cout << "Active screens: ";
    for (auto it = activeScreens.begin(); it != activeScreens.end(); ++it) {
        std::cout << *it << " ";
    }
    std::cout << std::endl;
}