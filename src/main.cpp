#include <GxEPD2_BW.h>
#include <Fonts/FreeMonoBold9pt7b.h>
#include "GxEPD2_display_selection_new_style.h"

#define PIN_ENABLE 2

void plansza1() {
  display.setFullWindow();
  display.firstPage();
  do {
    display.fillScreen(GxEPD_WHITE);
    display.setCursor(10, 30);
    display.print("plansza 1");
  } while (display.nextPage());
}

void plansza2() {
  display.setFullWindow();
  display.firstPage();
  do {
    display.fillScreen(GxEPD_WHITE);
    display.setCursor(10, 30);
    display.print("plansza 2");
  } while (display.nextPage());
}

void plansza3() {
  display.setFullWindow();
  display.firstPage();
  do {
    display.fillScreen(GxEPD_WHITE);
    display.setCursor(10, 30);
    display.print("plansza 3");
  } while (display.nextPage());
}

void setup() {
  pinMode(PIN_ENABLE, OUTPUT);
  digitalWrite(PIN_ENABLE, HIGH);
  display.init(115200, true, 2, false);
  display.setRotation(0);
  display.setFont(&FreeMonoBold9pt7b);
  display.setTextColor(GxEPD_BLACK);

  Serial.begin(115200);
}

void loop() {
  if (Serial.available() > 0) {
    char input = Serial.read(); 
    switch (input) {
      case '1':
        plansza1();
        break;
      case '2':
        plansza2();
        break;
      case '3':
        plansza3();
        break;
      default:
        break;
    }
    delay(100); 
  }
}
