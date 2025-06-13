#include "ScreenManager.h"

using DrawFunction = std::function<void()>;
std::unordered_map<int, DrawFunction> screens;
std::vector<int> activeScreens;
int currentScreen;

ScreenManager::Status ScreenManager::addScreen(int id, DrawFunction drawFunc) {
  if (screens.find(id) == screens.end()) {
    screens[id] = drawFunc;
  } else {
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
      return Status::DoesntExist;
    }
    screens.erase(it);
  } else {
    return Status::DoesntExist;
  }
}

ScreenManager::Status ScreenManager::setCurrentScreen(int id) {
  auto it = screens.find(id);
  if (it != screens.end()) {
    currentScreen = id;
    return Status::OK;
  } else {
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
      return Status::CurrentNotActive;
    }
  } else {
    return Status::NoActiveScreens;
  }
}

ScreenManager::Status ScreenManager::printCurrentScreen() const {
  if (std::find(activeScreens.begin(), activeScreens.end(), currentScreen) != activeScreens.end()) {
    screens.find(currentScreen)->second();
    return Status::OK;
  } else {
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
    } else {
      data.putBool(std::to_string(id).c_str(), false);
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
    }
  }
  data.end();
}

