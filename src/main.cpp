#include <vector>
#include <GxEPD2_BW.h>
#include <Fonts/FreeMonoBold9pt7b.h>
#include <FS.h>
#include <SPIFFS.h>
#include <BluetoothSerial.h>
#include <Preferences.h>
#include "GxEPD2_display_selection_new_style.h"
#include "images.h"
#include "elapsedMillis.h"
#include "Screen.h"

#define PIN_ENABLE 13

#define DEVICE_NAME "ESP32-BT-Test"

constexpr uint16_t LED_BT_CONNECTING_BLINK_PERIOD_MS = 500;
constexpr uint32_t DEEP_SLEEP_TIME_US =  10000000;
constexpr uint16_t BT_TIME_TO_CONNECT_MS = 3000;
constexpr uint16_t SERIAL_BT_TIMEOUT = 1000;
constexpr uint16_t MAX_BT_MESSAGE_LENGTH = 512;
constexpr uint8_t MAX_ACTIVE_SCREENS = 5;


bool isConnected = false;
bool dataUpdated = false;

BluetoothSerial SerialBT;
elapsedMillis ledBlink;
elapsedMillis connectWait;

Preferences Data;


struct ScheduleEntry {

  uint8_t day;    // dni tygodnia czyli 0 => pon, 4=> pt
  uint8_t hour;   // godzina rozpoczenia czyli 7 oznacza ze zaczyna sie o 7 a 15 ze o 15 
  String text; // to co ma byc wpisane

};

ScheduleEntry schedule[] = {

  {0, 14, "konsultacje"},
  {1, 12, "konsultacje"},
  {4, 11, "praca wlasna"},
  {3, 9, "praca wlasna"},
  {3, 10, "praca wlasna"}

};

void drawScreen0();
void drawScreen1();
void drawScreen2();
void onBTConnect();
void onBTDisconnect();
void saveDataToFlash(const String& key, const String& value);
void blinkLED();
void startDeepSleep();
String readSerialMessageBT();
void parseAndSaveToNVS(const String& data);

void setup() {

  // if (!SPIFFS.begin(true)) {

  //   Serial.println("SPIFFS initialization failed");
  //   return;

  // } else {

  //   Serial.println("SPIFFS initialized correctly");

  // }

  pinMode(PIN_ENABLE, OUTPUT);
  digitalWrite(PIN_ENABLE, HIGH);
  display.init(115200, true, 2, false);
  display.setRotation(0);
  display.setFont(&FreeMonoBold9pt7b);
  display.setTextColor(GxEPD_BLACK);

  Serial.begin(115200);

  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, 0);

  // Register event handlers
  SerialBT.register_callback([](esp_spp_cb_event_t event, esp_spp_cb_param_t* param) {

    if (event == ESP_SPP_SRV_OPEN_EVT) onBTConnect();
    if (event == ESP_SPP_CLOSE_EVT) onBTDisconnect();

  });

  Screen NameScreen(0, true, &drawScreen0);
  Screen ScheduleScreen(1, false, &drawScreen1);
  Screen QRScreen(2, true, &drawScreen2);

  SerialBT.begin(DEVICE_NAME);
  Serial.println("Waiting for BT connection...");

}

void loop() {

  if(isConnected) {

    digitalWrite(BUILTIN_LED, 1);
    
    if (SerialBT.available()) {

      String receivedData = readSerialMessageBT();

      /***************************************TO BE REPLACED BY ToF READING********************************/
      if (receivedData[1] != ':') {
        if(receivedData[0] == 'n'){
          Serial.println("next");
          Serial.println(Screen::activeScreenIndex);

          Screen::Next();
          Serial.println(Screen::activeScreenIndex);
          Screen::PrintActive();
        }

        if(receivedData[0] == 'p'){
          Screen::Previous();
          Screen::PrintActive();
        }
      }
      /***************************************TO BE REPLACED BY ToF READING********************************/

      Serial.println("Received data raw: " + receivedData);
      if(receivedData.length() > 0) {
        parseAndSaveToNVS(receivedData);
      }
    }
  }

  if(!isConnected) {

    if(ledBlink > LED_BT_CONNECTING_BLINK_PERIOD_MS) {

      blinkLED();
    }

    if(connectWait > BT_TIME_TO_CONNECT_MS) {

      startDeepSleep();
    }

  }

  if (dataUpdated) {

    Screen::PrintActive();
    dataUpdated  = false;
  }

}

void onBTConnect() {

  isConnected = true;
  Serial.println("Bluetooth device connected");
  
}

void onBTDisconnect() {

  isConnected = false;
  Serial.println("Bluetooth device disconnected");

}

void saveDataToFlash(const String& key, const String& value) {

  Data.begin("storage", false);  
  Data.putString(key.c_str(), value);
  Data.end(); 
  Serial.println("[NVS] Saved data: " + key + " = " + value);
  dataUpdated = true;

}

void drawScreen0() {

  display.setFullWindow();
  display.firstPage();

  do {

  Data.begin("storage", true);
  display.fillScreen(GxEPD_WHITE);
  display.fillRect(0, 0, 800, 100, GxEPD_BLACK);
  
  String room = Data.getString("1", "POKOJ 456");
  int16_t x1, y1;
  uint16_t textWidth1, textHeight1;
  display.setTextSize(2);
  display.getTextBounds(room, 0, 0, &x1, &y1, &textWidth1, &textHeight1);
  int centerX = (display.width() - textWidth1) / 2;
  display.setCursor(centerX, 60);
  display.setTextColor(GxEPD_WHITE);
  display.print(room);

  String name = Data.getString("2","DR INZ. KAMIL STAWIARSKI");
  int16_t x2, y2;
  uint16_t textWidth2, textHeight2;
  display.setTextSize(3);
  display.getTextBounds(name, 0, 0, &x2, &y2, &textWidth2, &textHeight2);
  int centerX2 = (display.width() - textWidth2) / 2;
  display.setCursor(centerX2, 200);
  display.setTextColor(GxEPD_BLACK);
  display.print(name);

  String tel = Data.getString("3","tel. 123 456 789");
  int16_t x3, y3;
  uint16_t textWidth3, textHeight3;
  display.setTextSize(2);
  display.getTextBounds(tel, 0, 0, &x3, &y3, &textWidth3, &textHeight3);
  int centerX3 = (display.width() - textWidth3) / 2;
  display.setCursor(centerX3, 300);
  display.print(tel);

  String mail = Data.getString("4","kamil.stawiarski@pg.edu.pl");
  int16_t x4, y4;
  uint16_t textWidth4, textHeight4;
  display.setTextSize(2);
  display.getTextBounds(mail, 0, 0, &x4, &y4, &textWidth4, &textHeight4);
  int centerX4 = (display.width() - textWidth4) / 2;
  display.setCursor(centerX4, 400);
  display.print(mail);

  Data.end();

  } while (display.nextPage());

  Serial.println("Print screen 1");

}

void drawScreen1() {

  display.setTextSize(1);
  const int startHour = 7;  
  const int endHour = 18; 
  const int numHours = endHour - startHour;

  const int screenWidth = display.width(); 
  const int screenHeight = display.height(); 

  const int gridXOffset = 80; 
  const int gridYOffset = 40; 

  const int colWidth = (screenWidth - gridXOffset) / 5; 
  const int rowHeight = (screenHeight - gridYOffset) / numHours; 

  const char* daysOfWeek[] = {"Pon", "Wt", "Sr", "Czw", "Pt"};
  const int numDays = 5; 

  display.setFullWindow();
  display.firstPage();

  do {

  display.fillScreen(GxEPD_WHITE); 
  
  for (int i = 0; i < numDays; i++) {
    int x = gridXOffset + i * colWidth; 
    display.drawRect(x, 0, colWidth, gridYOffset, GxEPD_BLACK); 
    display.setCursor(x + colWidth / 4, gridYOffset / 2); 
    display.print(daysOfWeek[i]);
  }
  
  for (int hour = startHour; hour < endHour; hour++) {
    int y = gridYOffset + (hour - startHour) * rowHeight;

    
    display.drawRect(0, y, gridXOffset, rowHeight, GxEPD_BLACK); 
    display.setCursor(10, y + rowHeight / 2); 
    String timeRange = String(hour) + "-" + String(hour + 1);
    display.print(timeRange);

    
    for (int i = 0; i < numDays; i++) {

      int x = gridXOffset + i * colWidth; 
      display.drawRect(x, y, colWidth, rowHeight, GxEPD_BLACK); 

    }

  }

  for (const auto& entry : schedule) {

    if (entry.hour >= startHour && entry.hour < endHour && entry.day >= 0 && entry.day < numDays) {

      int x = gridXOffset + entry.day * colWidth + 5; 
      int y = gridYOffset + (entry.hour - startHour) * rowHeight + 20; 

      display.setCursor(x, y);
      display.print(entry.text);

    }

  }
  } while (display.nextPage());

  Serial.println("Print screen 2");

}

void drawScreen2() {

  display.setFullWindow();
  display.firstPage();

  do {

  display.fillScreen(GxEPD_WHITE);

  display.drawXBitmap(50, 50,obrazek1, 300, 300, GxEPD_BLACK);
  display.setCursor(110, 400);
  display.setTextSize(2);
  display.print("Kanal YT");

  display.drawXBitmap(400, 50,obrazek1, 300, 300, GxEPD_BLACK);
  display.setCursor(430, 400);
  display.setTextSize(2);
  display.print("Most wiedzy");
  } while(display.nextPage());

  Serial.println("Print screen 3");

}

void blinkLED()
{
  digitalWrite(BUILTIN_LED, !digitalRead(BUILTIN_LED));
  ledBlink = 0;
}

void startDeepSleep(){

  Serial.println("zzzzz...");
  connectWait = 0;
  esp_sleep_enable_timer_wakeup(DEEP_SLEEP_TIME_US);
  esp_deep_sleep_start();
}

String readSerialMessageBT() {
  String buffer;
  unsigned long startTime = millis();
  
  while (millis() - startTime < SERIAL_BT_TIMEOUT) {
    while (SerialBT.available()) {
      char c = SerialBT.read();
      
      if (c == '\r') {
        return buffer;
      }
      
      if (buffer.length() >= MAX_BT_MESSAGE_LENGTH) {
        Serial.println("BT message too long!");
        return "";
      }
      
      buffer += c;
    }
  }
  
  Serial.println("Timeout waiting for BT message!");
  return "";
}

void parseAndSaveToNVS(const String& data) {
  int lineStart = 0;
  
  while (lineStart < data.length()) {
    int lineEnd = data.indexOf('\n', lineStart);
    
    if (lineEnd == -1) {
      lineEnd = data.length();
    }

    String line = data.substring(lineStart, lineEnd);
    line.trim();  // Remove leading/trailing whitespace
    
    if (line.length() > 0) {
      int colonIndex = line.indexOf(':');
      
      if (colonIndex != -1) {
        String key = line.substring(0, colonIndex);
        String value = line.substring(colonIndex + 1);
        
        // Trim key and value in case of spaces
        key.trim();
        value.trim();
        
        if (key.length() > 0 && value.length() > 0) {
          //save to NVS
          saveDataToFlash(key, value);
        }
      }
    }
    
    lineStart = lineEnd + 1;  // Move to next line
  }
}
