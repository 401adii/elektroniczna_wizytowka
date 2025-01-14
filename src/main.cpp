#include <GxEPD2_BW.h>
#include <Fonts/FreeMonoBold9pt7b.h>
#include <FS.h>
#include <SPIFFS.h>
#include <BluetoothSerial.h>
#include <Preferences.h>
#include "GxEPD2_display_selection_new_style.h"
#include "images.h"
#include "elapsedMillis.h"

#define PIN_ENABLE 13

#define DEVICE_NAME "ESP32-BT-Test"
#define LED_BT_CONNECTING_BLINK_PERIOD_MS 500
#define DEEP_SLEEP_TIME_US 10000000
#define BT_TIME_TO_CONNECT_MS 3000

bool isConnected = false;
bool dataUpdated = false;
char received;
int currentscreen = 1;

BluetoothSerial SerialBT;
elapsedMillis ledBlink;
elapsedMillis connectWait;

Preferences data;

int input;

struct ScheduleEntry {

  int day;    // dni tygodnia czyli 0 => pon, 4=> pt
  int hour;   // godzina rozpoczenia czyli 7 oznacza ze zaczyna sie o 7 a 15 ze o 15 
  String text; // to co ma byc wpisane

};

ScheduleEntry schedule[] = {

  {0, 14, "konsultacje"},
  {1, 12, "konsultacje"},
  {4, 11, "praca wlasna"},
  {3, 9, "praca wlasna"},
  {3, 10, "praca wlasna"}

};

void screen1();
void screen2();
void screen3();
void onBTConnect();
void onBTDisconnect();
void saveDataToFlash(const String& key, const String& value);

void setup() {

  if (!SPIFFS.begin(true)) {

    Serial.println("SPIFFS initialization failed");
    return;

  } else {

    Serial.println("SPIFFS initialized correctly");

  }

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

  SerialBT.begin(DEVICE_NAME);
  Serial.println("Waiting for BT connection...");

}

void loop() {

  if(isConnected) {

    digitalWrite(BUILTIN_LED, 1);
    
    if (SerialBT.available()) {

      String receivedData = SerialBT.readStringUntil('\n');

      if ((receivedData[0] == '1'||receivedData[0] == '2'||receivedData[0] == '3')&& receivedData[1] != '.') {

        input = receivedData[0];

      }

      Serial.println("Received data: " + receivedData);
      int separatorIndex = receivedData.indexOf('.');

      if (separatorIndex != -1) {

        String key = receivedData.substring(0, separatorIndex);
        String value = receivedData.substring(separatorIndex + 1);
        saveDataToFlash(key, value);

      } else {

        Serial.println("Incorrect data format");

      }
      
      Serial.write(received);

    }

  }

  if(!isConnected) {

    if(ledBlink > LED_BT_CONNECTING_BLINK_PERIOD_MS) {

      digitalWrite(BUILTIN_LED, !digitalRead(BUILTIN_LED));
      ledBlink = 0;

    }

    if(connectWait > BT_TIME_TO_CONNECT_MS) {

      Serial.println("zzzzz...");
      connectWait = 0;
      esp_sleep_enable_timer_wakeup(DEEP_SLEEP_TIME_US);
      esp_deep_sleep_start();

    }

  }

  if (dataUpdated) {

    switch (currentscreen) {

      case 1:
      screen1();
      break;
      case 2:
      screen2();
      break;
      case 3:
      screen3();
      break;
      default:
      break;

    }

    dataUpdated  = false;

  }

  switch (input) {

    case '1':
      currentscreen = 1;
      input = -1;
      screen1();
      break;

    case '2':
      currentscreen = 2;
      input = -1;
      screen2();
      break;

    case '3':
      currentscreen = 3;
      input = -1;
      screen3();
      break;

    default:
      input = -1;
      break;

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

void saveDataToFlash(const String& key, const String& value) { // zapis danych w formie klucz -> wartosc do flasha

  data.begin("storage", false);  
  data.putString(key.c_str(), value);
  data.end(); 
  Serial.println("[NVS] Saved data: " + key + " = " + value);
  dataUpdated = true;

}

void screen1() {

  display.setFullWindow();
  display.firstPage();

  do {

  data.begin("storage", true);
  display.fillScreen(GxEPD_WHITE);
  display.fillRect(0, 0, 800, 100, GxEPD_BLACK);
  
  String room = data.getString("1", "POKOJ 456");
  int16_t x1, y1;
  uint16_t textWidth1, textHeight1;
  display.setTextSize(2);
  display.getTextBounds(room, 0, 0, &x1, &y1, &textWidth1, &textHeight1);
  int centerX = (display.width() - textWidth1) / 2;
  display.setCursor(centerX, 60);
  display.setTextColor(GxEPD_WHITE);
  display.print(room);

  String name = data.getString("2","DR INZ. KAMIL STAWIARSKI");
  int16_t x2, y2;
  uint16_t textWidth2, textHeight2;
  display.setTextSize(3);
  display.getTextBounds(name, 0, 0, &x2, &y2, &textWidth2, &textHeight2);
  int centerX2 = (display.width() - textWidth2) / 2;
  display.setCursor(centerX2, 200);
  display.setTextColor(GxEPD_BLACK);
  display.print(name);

  String tel = data.getString("3","tel. 123 456 789");
  int16_t x3, y3;
  uint16_t textWidth3, textHeight3;
  display.setTextSize(2);
  display.getTextBounds(tel, 0, 0, &x3, &y3, &textWidth3, &textHeight3);
  int centerX3 = (display.width() - textWidth3) / 2;
  display.setCursor(centerX3, 300);
  display.print(tel);

  String mail = data.getString("4","kamil.stawiarski@pg.edu.pl");
  int16_t x4, y4;
  uint16_t textWidth4, textHeight4;
  display.setTextSize(2);
  display.getTextBounds(mail, 0, 0, &x4, &y4, &textWidth4, &textHeight4);
  int centerX4 = (display.width() - textWidth4) / 2;
  display.setCursor(centerX4, 400);
  display.print(mail);

  data.end();

  } while (display.nextPage());

  Serial.println("Print screen 1");

}

void screen2() {

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

void screen3() {

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
