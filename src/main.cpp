#include <GxEPD2_BW.h>
#include <Fonts/FreeMonoBold9pt7b.h>
#include <FS.h>
#include <SPIFFS.h>
#include "GxEPD2_display_selection_new_style.h"
#include "images.h"


#define PIN_ENABLE 2


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

void screen1() {

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
}

void screen3() {
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
}


void setup() {


  if (!SPIFFS.begin(true)) {
    Serial.println("Nie udało się zainicjować SPIFFS");
    return;
  } else {
    Serial.println("SPIFFS zainicjowany pomyślnie.");
  }

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

        screen1();

        break;

      case '2':

        screen2();

        break;

      case '3':

        screen3();

        break;

      default:

        break;
    }

    delay(100); 

  }

}




