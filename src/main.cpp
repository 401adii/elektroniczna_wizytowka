#include <GxEPD2_BW.h>
#include <Fonts/FreeMonoBold9pt7b.h>
#include "GxEPD2_display_selection_new_style.h"

#define PIN_ENABLE 2

const char text1[] = "napis1";
const char text2[] = "napis2";
const char* aktualnyNapis = text1;

void displayText(const char* text)
{
  int16_t tbx, tby;
  uint16_t tbw, tbh;
  display.getTextBounds(text, 0, 0, &tbx, &tby, &tbw, &tbh);

  uint16_t x = ((display.width() - tbw) / 2) - tbx;
  uint16_t y = ((display.height() - tbh) / 2) - tby;

  uint16_t frameX = x + tbx - 10; 
  uint16_t frameY = y + tby - 10;
  uint16_t frameWidth = tbw + 20; 
  uint16_t frameHeight = tbh + 20;

  display.setFullWindow();
  display.firstPage();
  do
  {
    display.fillScreen(GxEPD_WHITE);

    for (int i = 0; i < 5; i++) {
      display.drawRect(i, i, display.width() - 2 * i, display.height() - 2 * i, GxEPD_BLACK);
    }

    display.drawRect(frameX, frameY, frameWidth, frameHeight, GxEPD_BLACK);
    
  
    display.setCursor(x, y);
    display.print(text);
  } 
  while (display.nextPage());
}

void setup()
{
  pinMode(PIN_ENABLE, OUTPUT);
  digitalWrite(PIN_ENABLE, HIGH);
  display.init(115200, true, 2, false);
  display.setRotation(1);
  display.setFont(&FreeMonoBold9pt7b);
  display.setTextColor(GxEPD_BLACK);
}

void loop()
{
  displayText(aktualnyNapis);

  if (aktualnyNapis == text1)
  {
    aktualnyNapis = text2;
  }
  else
  {
    aktualnyNapis = text1;
  }

  delay(2000); 
}
