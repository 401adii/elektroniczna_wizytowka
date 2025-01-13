#include <GxEPD2_BW.h>
#include <Fonts/FreeMonoBold9pt7b.h>
#include <FS.h>
#include <SPIFFS.h>
#include "GxEPD2_display_selection_new_style.h"
#include "images.h"
#include <BluetoothSerial.h>

#define DEVICE_NAME "ESP32-BT-Test"
#define LED_BT_CONNECTING_BLINK_PERIOD_MS 500
#define DEEP_SLEEP_TIME_US 10000000
#define BT_TIME_TO_CONNECT_MS 3000
#define PIN_ENABLE 13

BluetoothSerial SerialBT;
bool isConnected = false;
char received;

TaskHandle_t LEDBlinkConnecting_h = NULL;

void onBTConnect();
void onBTDisconnect();
void keepBT(void* params);
void readBT(void* params);
void LEDBlinkConnecting(void* params);
void screen1(void* params);
void screen2(void* params);
void screen3(void* params);

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


void setup() {

  if (!SPIFFS.begin(true)) {
    Serial.println("Nie udało się zainicjować SPIFFS");
    return;
  } else {
    Serial.println("SPIFFS zainicjowany pomyślnie.");
  }

  pinMode(PIN_ENABLE, OUTPUT);
  digitalWrite(PIN_ENABLE, HIGH);
  display.init(115200, true, PIN_ENABLE, false);
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

    // Tasks
    xTaskCreate(keepBT, "BT_keep_task", 4*1024, NULL, 1, NULL);
    xTaskCreate(readBT, "BT_read_task", 2048, NULL, 1, NULL);
    xTaskCreate(LEDBlinkConnecting, "LED_blink_connecting_task", 1024, NULL, 1, &LEDBlinkConnecting_h);
}

void loop() {
  int input = received;

  switch (input) {

    case '1':
      xTaskCreate(screen1, "screen1_task", 4*1024, NULL, 1, NULL);
      input =-1;
      break;

    case '2':
      xTaskCreate(screen2, "screen2_task", 4*1024, NULL, 1, NULL);
      input =-1;
      break;

    case '3':
      xTaskCreate(screen3, "screen3_task", 4*1024, NULL, 1, NULL);
      input =-1;
      break;

    default:
      input = -1;
      break;
  }

  vTaskDelay(100 / portTICK_PERIOD_MS); 
}

void screen1(void* params) {
  
  display.setFullWindow();
  display.firstPage();

  do {

    display.fillScreen(GxEPD_WHITE);
    display.fillRect(0, 0, 800, 100, GxEPD_BLACK);
    display.setCursor(300, 60);
    display.setTextSize(2);
    display.setTextColor(GxEPD_WHITE);
    display.print("POKOJ 456");
    display.setCursor(10, 200);
    display.setTextSize(3);
    display.setTextColor(GxEPD_BLACK);
    display.print("DR INZ. KAMIL STAWIARSKI");
    display.setTextSize(2);
    display.setCursor(230, 300);
    display.print("tel. 123 456 789");
    display.setCursor(140, 400);
    display.print("kamil.stawiarski@pg.edu.pl");
  } while (display.nextPage());

  Serial.println("Printed screen 1");
  vTaskDelete(NULL);

}

void screen2(void* params) {

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

  Serial.println("Printed screen 2");
  vTaskDelete(NULL);
}

void screen3(void* params) {
  display.setFullWindow();
  display.firstPage();

  do {
    display.fillScreen(GxEPD_WHITE);
  

    display.drawBitmap(50, 50,obrazek1, 300, 300, GxEPD_BLACK);
    display.setCursor(110, 400);
    display.setTextSize(2);
    display.print("Kanal YT");


    display.drawBitmap(400, 50,obrazek1, 300, 300, GxEPD_BLACK);
    display.setCursor(430, 400);
    display.setTextSize(2);
    display.print("Most wiedzy");

  } while (display.nextPage());

  Serial.println("Printed screen 3");
  vTaskDelete(NULL);
}

void onBTConnect()
{
  isConnected = true;
  if(LEDBlinkConnecting_h != NULL)
  {
    vTaskSuspend(LEDBlinkConnecting_h);
    digitalWrite(LED_BUILTIN, 1);
  }
  
  Serial.println("Bluetooth device connected");
}

void onBTDisconnect()
{
  isConnected = false;
  Serial.println("Bluetooth device disconnected");
  if(LEDBlinkConnecting_h != NULL)
    vTaskResume(LEDBlinkConnecting_h);
}

void keepBT(void* params)
{
  while(1)
  {
    if (!isConnected)
    {
      SerialBT.begin(DEVICE_NAME);
      Serial.println("Waiting for BT connection...");
      vTaskDelay(BT_TIME_TO_CONNECT_MS / portTICK_PERIOD_MS);
      if(!isConnected)
      {
        Serial.println("zzzzz...");
        esp_sleep_enable_timer_wakeup(DEEP_SLEEP_TIME_US);
        esp_deep_sleep_start();
      }
    }
    else
    {
      vTaskDelay(50 / portTICK_PERIOD_MS); // Small delay to prevent busy-waiting
    }
  }

}

void readBT(void* params)
{
  while(1)
  {
    if (isConnected && SerialBT.available())
    {
      received = SerialBT.read();
      Serial.write(received);
    }
    vTaskDelay(50 / portTICK_PERIOD_MS); // Small delay to prevent busy-waiting
  }
}

void LEDBlinkConnecting(void* params)
{
  while(1)
  {
    digitalWrite(BUILTIN_LED, 1);
    vTaskDelay(LED_BT_CONNECTING_BLINK_PERIOD_MS / portTICK_PERIOD_MS);
    digitalWrite(BUILTIN_LED, 0);
    vTaskDelay(LED_BT_CONNECTING_BLINK_PERIOD_MS / portTICK_PERIOD_MS);
  }
}