#include "ScreenManager.h"

using DrawFunction = std::function<void()>;
std::unordered_map<int, DrawFunction> screens;
std::vector<int> activeScreens;
int currentScreen;

ScreenManager::Status ScreenManager::addScreen(int id, DrawFunction drawFunc) {
  if (screens.find(id) == screens.end()) {
    screens[id] = drawFunc;
  } else {
    std::cout << "Screen with ID " << id << " already exists." << std::endl;
    return Status::RepetedID;
  }
  return Status::OK;
}

ScreenManager::Status ScreenManager::removeScreen(int id) {
  auto it = screens.find(id);
  if (it != screens.end()) {
    auto iter = std::find(activeScreens.begin(), activeScreens.end(), id);
    if (iter != activeScreens.end()) {
      activeScreens.erase(iter);
      return Status::OK;
    } else {
      std::cout << "Screen with ID " << id << " does not exist in the active screens list." << std::endl;
      return Status::DoesntExist;
    }
    screens.erase(it);
  } else {
    std::cout << "Screen with ID " << id << " does not exist." << std::endl;
    return Status::DoesntExist;
  }
}

ScreenManager::Status ScreenManager::setCurrentScreen(int id) {
  auto it = screens.find(id);
  if (it != screens.end()) {
    currentScreen = id;
    return Status::OK;
  } else {
    std::cout << "Screen with ID " << id << " does not exist." << std::endl;
    return Status::DoesntExist;
  }
}

ScreenManager::Status ScreenManager::nextScreen() {
  if (!activeScreens.empty()) {
    auto it = std::find(activeScreens.begin(), activeScreens.end(), currentScreen);
    if (it != activeScreens.end() && ++it != activeScreens.end()) {
      currentScreen = *it;
    } else {
      currentScreen = activeScreens.front();
    }
    return Status::OK;
  } else {
    std::cout << "No active screens to move to the next screen." << std::endl;
    return Status::NoActiveScreens;
  }
}

ScreenManager::Status ScreenManager::prevScreen() {
  if (!activeScreens.empty()) {
    auto it = std::find(activeScreens.begin(), activeScreens.end(), currentScreen);
    if (it != activeScreens.end()) {
      if (it != activeScreens.begin()) {
        --it;
        currentScreen = *it;
      } else {
        currentScreen = activeScreens.back();
      }
      return Status::OK;
    } else {
      std::cout << "Current screen not found in active screens." << std::endl;
      return Status::CurrentNotActive;
    }
  } else {
    std::cout << "No active screens to move to the previous screen." << std::endl;
    return Status::NoActiveScreens;
  }
}

ScreenManager::Status ScreenManager::printCurrentScreen() const {
  if (std::find(activeScreens.begin(), activeScreens.end(), currentScreen) != activeScreens.end()) {
    screens.find(currentScreen)->second();
    return Status::OK;
  } else {
    std::cout << "No current screen to print. Current screen should be: " << currentScreen << std::endl;
    return Status::CurrentNotActive;
  }
}

void ScreenManager::saveScreens(Preferences &data, const char *name) const {
  data.begin(name, false);

  for (auto it = screens.begin(); it != screens.end(); it++) {
    int id = it->first;
    auto iter = std::find(activeScreens.begin(), activeScreens.end(), id);
    if (iter != activeScreens.end()) {
      data.putBool(std::to_string(id).c_str(), true);
      std::cout << "[NVS] Saved data: " << id << " = true" << std::endl;
    } else {
      data.putBool(std::to_string(id).c_str(), false);
      std::cout << "[NVS] Saved data: " << id << " = false" << std::endl;
    }
  }
  data.end();
}

void ScreenManager::readAndSetActiveScreens(Preferences &data, const char *name) {
  data.begin(name, true);
  activeScreens.clear();
  for (auto it = screens.begin(); it != screens.end(); it++) {
    int id = it->first;
    String value = data.getString(std::to_string(id).c_str(), "0");
    if (value == "1") {
      activeScreens.push_back(id);
      std::cout << "[NVS] Read data: " << id << " = true" << std::endl;
    }
  }
  data.end();
  infoActiveScreens();
}

void ScreenManager::infoActiveScreens() const {
  std::cout << "Active screens: ";
  for (auto it = activeScreens.begin(); it != activeScreens.end(); ++it) {
    std::cout << *it << " ";
  }
  std::cout << std::endl;
}

void ScreenManager::infoCurrentScreen() const { std::cout << "Current screen: " << currentScreen << std::endl; }

void ScreenManager::printInfo() const {
  std::cout << "------------------------------" << std::endl;
  std::cout << "SCREEN MANAGER INFO" << std::endl;
  infoActiveScreens();
  infoCurrentScreen();
  std::cout << "------------------------------" << std::endl;
}