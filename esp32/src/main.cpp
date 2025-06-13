#include <BluetoothSerial.h>
#include <Crypto.h>
#include <Fonts/FreeMonoBold9pt7b.h>
#include <GxEPD2_BW.h>
#include <Preferences.h>
#include <SHA256.h>
#include <string.h>

#include "../include/key.h"
#include "GxEPD2_display_selection_new_style.h"
#include "ScreenManager.h"
#include "driver/rtc_io.h"
#include "elapsedMillis.h"
#include "esp_attr.h"
#include "esp_sleep.h"
#include "qrcodegen.h"

#define WAKEUP_BITMASK 0x6000
#define DEVICE_NAME "E-wizytowka"
#define SCREEN_CONNECTED 1  // 1 for testink with an eink
#define SECURE_BT 1         // 1 to enable
#define PIN_ENABLE 32

constexpr uint16_t LED_BT_CONNECTING_BLINK_PERIOD_MS = 500;
constexpr uint16_t BT_TIME_TO_CONNECT_MS = 40000;
constexpr uint16_t BT_AUTH_TIMEOUT_MS = 1500;
constexpr uint16_t SERIAL_BT_TIMEOUT = 500;
constexpr uint16_t MAIN_SCREEN_TIMEOUT_MS = 30000;
constexpr uint16_t MAX_BT_MESSAGE_LENGTH = 2048;
constexpr uint8_t MAX_ACTIVE_SCREENS = 4;
constexpr uint8_t BUTTON_LEFT_PIN = 13;
constexpr uint8_t BUTTON_RIGHT_PIN = 14;
constexpr uint8_t HASH_SIZE = 32;
constexpr char DATA_STORAGE_NAME[] = "storage";
constexpr char SECRET_KEY[] = _SECRET_KEY;
int Screen = 0;

static uint8_t qrcodeTemp[qrcodegen_BUFFER_LEN_MAX];
static uint8_t qrcodeData[qrcodegen_BUFFER_LEN_MAX];
static portMUX_TYPE button_spinlock = portMUX_INITIALIZER_UNLOCKED;

bool isConnected = false;
bool dataUpdated = false;
bool isAuthorized = false;

uint8_t button_pressed = 0; /*1 -> left; 2 -> right*/

BluetoothSerial SerialBT;
elapsedMillis ledBlink;
elapsedMillis connectWait;
elapsedMillis screenTimeoutTimer;

SHA256 sha256;
Preferences Data;
ScreenManager screenManager;

void drawScreen0();
void drawScreen1();
void drawScreen2();
void onBTConnect();
void onBTDisconnect();
void saveStringToFlash(const String &key, const String &value);
void blinkLED();
void startDeepSleep();
String readSerialMessageBT();
void parseAndSaveToNVS(const String &data);
void drawQRCode(const char *text, int16_t x, int16_t y);
void IRAM_ATTR left_button_ISR();
void IRAM_ATTR right_button_ISR();
bool authorizeBT();
void clear_table();
void clear_screen0();

void setup() {
  pinMode(PIN_ENABLE, OUTPUT);
  digitalWrite(PIN_ENABLE, HIGH);

  pinMode(BUTTON_LEFT_PIN, INPUT);
  pinMode(BUTTON_RIGHT_PIN, INPUT);
  esp_sleep_enable_ext1_wakeup(WAKEUP_BITMASK, ESP_EXT1_WAKEUP_ANY_HIGH);
  attachInterrupt(digitalPinToInterrupt(BUTTON_LEFT_PIN), left_button_ISR, RISING);
  attachInterrupt(digitalPinToInterrupt(BUTTON_RIGHT_PIN), right_button_ISR, RISING);

  display.init(115200, true, 2, false);
  display.setRotation(0);
  display.setFont(&FreeMonoBold9pt7b);
  display.setTextColor(GxEPD_BLACK);

  Serial.begin(115200);

  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, 0);

  // Register event handlers
  SerialBT.register_callback([](esp_spp_cb_event_t event, esp_spp_cb_param_t *param) {
    if (event == ESP_SPP_SRV_OPEN_EVT) onBTConnect();
    if (event == ESP_SPP_CLOSE_EVT) onBTDisconnect();
  });

  SerialBT.begin(DEVICE_NAME);
  SerialBT.setPin("1234");
  SerialBT.enableSSP();

  screenManager.addScreen(0, &drawScreen0);
  screenManager.addScreen(1, &drawScreen1);
  screenManager.addScreen(2, &drawScreen2);
  screenManager.readAndSetActiveScreens(Data, DATA_STORAGE_NAME);
}

void loop() {
  if (button_pressed != 0) {
    if (button_pressed == 1) {
      // left
      while (ScreenManager::Status::CurrentNotActive == screenManager.prevScreen()) {
      };

    } else if (button_pressed == 2) {
      // right
      screenManager.nextScreen();
    }
    connectWait = 0;
    screenManager.printCurrentScreen();
    button_pressed = 0;
  }

  if (isConnected) {
#if SECURE_BT
    if (!isAuthorized) {
      isAuthorized = authorizeBT();
    }
#endif
    digitalWrite(BUILTIN_LED, 1);

    if (SerialBT.available()) {
      String receivedData = readSerialMessageBT();
      if (receivedData.length() > 0) {
        parseAndSaveToNVS(receivedData);
      }
    }
  }

  if (!isConnected) {
    if (ledBlink > LED_BT_CONNECTING_BLINK_PERIOD_MS) {
      blinkLED();
    }

    if (connectWait > BT_TIME_TO_CONNECT_MS) {
      startDeepSleep();
    }
  }

  if (dataUpdated) {
    // clear
    clear_table();
    clear_screen0();
    screenManager.readAndSetActiveScreens(Data, DATA_STORAGE_NAME);
    dataUpdated = false;
    while (screenManager.printCurrentScreen() == ScreenManager::Status::CurrentNotActive) {
      screenManager.nextScreen();
      dataUpdated = true;
    }
    connectWait = 0;
  }

  if (Screen != 0) {
    if (screenTimeoutTimer > MAIN_SCREEN_TIMEOUT_MS) {
      drawScreen0();
      screenTimeoutTimer = 0;
    }
  }
}

void onBTConnect() {
  isConnected = true;
  isAuthorized = false;
}

void onBTDisconnect() {
  isConnected = false;
  isAuthorized = false;
}

void saveStringToFlash(const String &key, const String &value) {
  Data.begin(DATA_STORAGE_NAME, false);
  Data.putString(key.c_str(), value);
  Data.end();
  dataUpdated = true;
}

void drawScreen0() {
  Screen = 0;
  screenTimeoutTimer = 0;
#if SCREEN_CONNECTED
  display.setFullWindow();
  display.firstPage();

  do {
    Data.begin("storage", true);
    display.fillScreen(GxEPD_WHITE);
    display.fillRect(0, 0, 800, 100, GxEPD_BLACK);

    String room = Data.getString("01", " ");
    int16_t x1, y1;
    uint16_t textWidth1, textHeight1;
    display.setTextSize(2);
    display.getTextBounds(room, 0, 0, &x1, &y1, &textWidth1, &textHeight1);
    int centerX = (display.width() - textWidth1) / 2;
    display.setCursor(centerX, 60);
    display.setTextColor(GxEPD_WHITE);
    display.print(room);

    String name = Data.getString("02", " ");
    int16_t x2, y2;
    uint16_t textWidth2, textHeight2;
    display.setTextSize(3);
    display.getTextBounds(name, 0, 0, &x2, &y2, &textWidth2, &textHeight2);
    int centerX2 = (display.width() - textWidth2) / 2;
    display.setCursor(centerX2, 200);
    display.setTextColor(GxEPD_BLACK);
    display.print(name);

    String tel = Data.getString("03", " ");
    int16_t x3, y3;
    uint16_t textWidth3, textHeight3;
    display.setTextSize(2);
    display.getTextBounds(tel, 0, 0, &x3, &y3, &textWidth3, &textHeight3);
    int centerX3 = (display.width() - textWidth3) / 2;
    display.setCursor(centerX3, 300);
    display.print(tel);

    String mail = Data.getString("04", " ");
    int16_t x4, y4;
    uint16_t textWidth4, textHeight4;
    display.setTextSize(2);
    display.getTextBounds(mail, 0, 0, &x4, &y4, &textWidth4, &textHeight4);
    int centerX4 = (display.width() - textWidth4) / 2;
    display.setCursor(centerX4, 400);
    display.print(mail);

    Data.end();

  } while (display.nextPage());

#endif
}

void drawScreen1() {
  Screen = 1;
  screenTimeoutTimer = 0;
#if SCREEN_CONNECTED
  display.setTextSize(1);
  display.setFont(&FreeMonoBold9pt7b);

  Data.begin(DATA_STORAGE_NAME, true);
  int numCols = Data.getString("1x", "3").toInt();
  int numRows = Data.getString("1y", "5").toInt();
  numCols = constrain(numCols, 1, 20);
  numRows = constrain(numRows, 1, 20);

  const int screenWidth = display.width();
  const int screenHeight = display.height();
  const int gridXOffset = 100;
  const int gridYOffset = 50;
  const int colWidth = (screenWidth - gridXOffset) / numCols;
  const int rowHeight = (screenHeight - gridYOffset) / numRows;

  // Lambda to calculate text width using getTextBounds
  auto getTextWidth = [&](const String &text) -> uint16_t {
    int16_t x1, y1;
    uint16_t w, h;
    display.getTextBounds(text, 0, 0, &x1, &y1, &w, &h);
    return w;
  };

  // Lambda to shorten text to fit maxWidth
  auto shortenTextToFit = [&](const String &text, uint16_t maxWidth) -> String {
    if (text.isEmpty()) return text;

    if (getTextWidth(text) <= maxWidth) return text;

    const String ellipsis = "...";
    uint16_t ellipsisWidth = getTextWidth(ellipsis);

    if (ellipsisWidth > maxWidth) return "";

    int low = 1;
    int high = text.length();
    String candidate;
    int bestMatch = 0;

    while (low <= high) {
      int mid = (low + high) / 2;
      candidate = text.substring(0, mid) + ellipsis;

      if (getTextWidth(candidate) <= maxWidth) {
        bestMatch = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return (bestMatch > 0) ? text.substring(0, bestMatch) + ellipsis : ellipsis;
  };

  display.setFullWindow();
  display.firstPage();

  do {
    display.fillScreen(GxEPD_WHITE);

    // Column headers
    for (int col = 0; col < numCols; col++) {
      int x = gridXOffset + col * colWidth;
      display.drawRect(x, 0, colWidth, gridYOffset, GxEPD_BLACK);

      String headerKey = "1hC" + String(col + 1);
      String headerText = Data.getString(headerKey.c_str(), " ");

      uint16_t maxAllowedHeaderWidth = colWidth - 4;
      String headerToDisplay = shortenTextToFit(headerText, maxAllowedHeaderWidth);

      int16_t x1, y1;
      uint16_t w, h;
      display.getTextBounds(headerToDisplay, 0, 0, &x1, &y1, &w, &h);
      int textX = x + (colWidth - w) / 2 - x1;
      int textY = (gridYOffset - h) / 2 - y1;

      display.setCursor(textX, textY);
      display.print(headerToDisplay);
    }

    // Rows and cells
    for (int row = 0; row < numRows; row++) {
      int y = gridYOffset + row * rowHeight;

      // Row header
      display.drawRect(0, y, gridXOffset, rowHeight, GxEPD_BLACK);

      String rowKey = "1hR" + String(row + 1);
      String rowText = Data.getString(rowKey.c_str(), " ");

      uint16_t maxAllowedRowWidth = gridXOffset - 4;
      String rowToDisplay = shortenTextToFit(rowText, maxAllowedRowWidth);

      int16_t x1, y1;
      uint16_t w, h;
      display.getTextBounds(rowToDisplay, 0, 0, &x1, &y1, &w, &h);
      int textX = (gridXOffset - w) / 2 - x1;
      int textY = y + (rowHeight - h) / 2 - y1;

      display.setCursor(textX, textY);
      display.print(rowToDisplay);

      // Data cells
      for (int col = 0; col < numCols; col++) {
        int x = gridXOffset + col * colWidth;
        display.drawRect(x, y, colWidth, rowHeight, GxEPD_BLACK);

        String cellKey = "1" + String(col + 1) + String(row + 1);
        String cellValue = Data.getString(cellKey.c_str(), "");

        if (!cellValue.isEmpty()) {
          uint16_t maxAllowedCellWidth = colWidth - 4;
          String cellToDisplay = shortenTextToFit(cellValue, maxAllowedCellWidth);

          int16_t x1_val, y1_val;
          uint16_t w_val, h_val;
          display.getTextBounds(cellToDisplay, 0, 0, &x1_val, &y1_val, &w_val, &h_val);
          int textX_val = x + (colWidth - w_val) / 2 - x1_val;
          int textY_val = y + (rowHeight - h_val) / 2 - y1_val;

          display.setCursor(textX_val, textY_val);
          display.print(cellToDisplay);
        }
      }
    }

  } while (display.nextPage());

  Data.end();
#endif
}

void drawScreen2() {
  Screen = 2;
  screenTimeoutTimer = 0;
#if SCREEN_CONNECTED
  display.setFullWindow();
  display.firstPage();

  do {
    display.fillScreen(GxEPD_WHITE);

    // Pobierz dane z pamięci
    Data.begin(DATA_STORAGE_NAME, true);
    String link1 = Data.getString("link1", "https://example.com/1");
    String link2 = Data.getString("link2", "https://example.com/2");
    String text1 = Data.getString("tekst1", "napis1");
    String text2 = Data.getString("tekst2", "napis2");
    Data.end();

    // Parametry ekranu
    const uint16_t screenWidth = display.width();
    const uint16_t screenHeight = display.height();
    const uint16_t halfWidth = screenWidth / 2;

    // Nowe stałe dla układu
    const uint16_t qrSize = 300;         // Zwiększony rozmiar kodu QR
    const uint16_t qrLeftMargin = 40;    // Margines od lewej krawędzi sekcji
    const uint16_t qrTopMargin = 30;     // Margines od góry dla QR
    const uint16_t textTopMargin = 400;  // Tekst znacznie niżej
    const uint8_t textSize = 2;

    // Funkcja pomocnicza do centrowania tekstu w sekcji
    auto centerText = [&](const String &text, uint16_t sectionX) {
      int16_t x, y;
      uint16_t w, h;
      display.getTextBounds(text, 0, 0, &x, &y, &w, &h);
      return sectionX + (halfWidth - w) / 2;
    };

    // Lewa sekcja
    drawQRCode(link1.c_str(), qrLeftMargin, qrTopMargin);  // QR bliżej lewej krawędzi
    display.setTextSize(textSize);
    display.setCursor(centerText(text1, 0), textTopMargin);
    display.print(text1);

    // Prawa sekcja
    const uint16_t rightQRX = halfWidth + qrLeftMargin;
    drawQRCode(link2.c_str(), rightQRX, qrTopMargin);  // QR bliżej środka ekranu
    display.setTextSize(textSize);
    display.setCursor(centerText(text2, halfWidth), textTopMargin);
    display.print(text2);

  } while (display.nextPage());
#endif
}

void blinkLED() {
  digitalWrite(BUILTIN_LED, !digitalRead(BUILTIN_LED));
  ledBlink = 0;
}

void startDeepSleep() {
  connectWait = 0;
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
        return "";
      }

      buffer += c;
    }
  }

  return "";
}

void parseAndSaveToNVS(const String &data) {
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
          // save to NVS
          saveStringToFlash(key, value);
        }
      }
    }
    lineStart = lineEnd + 1;  // Move to next line
  }
}

void drawQRCode(const char *text, int16_t x, int16_t y) {
  bool ok = qrcodegen_encodeText(text, qrcodeTemp, qrcodeData, qrcodegen_Ecc_LOW, qrcodegen_VERSION_MIN,
                                 qrcodegen_VERSION_MAX, qrcodegen_Mask_AUTO, true);
  if (!ok) {
    return;
  }

  int size = qrcodegen_getSize(qrcodeData);

  int moduleSize = ceilf(300.0f / size);  // tu zeby qr byl 300x300

  for (int row = 0; row < size; row++) {
    for (int col = 0; col < size; col++) {
      if (qrcodegen_getModule(qrcodeData, col, row)) {
        display.fillRect(x + col * moduleSize, y + row * moduleSize, moduleSize, moduleSize, GxEPD_BLACK);
      }
    }
  }
}

void IRAM_ATTR left_button_ISR() {
  portENTER_CRITICAL_ISR(&button_spinlock);
  button_pressed = 1;
  portEXIT_CRITICAL_ISR(&button_spinlock);
}

void IRAM_ATTR right_button_ISR() {
  portENTER_CRITICAL_ISR(&button_spinlock);
  button_pressed = 2;
  portEXIT_CRITICAL_ISR(&button_spinlock);
}

bool authorizeBT() {
  // 8 digit number formatted as string with leading zeros
  char challenge[9];
  snprintf(challenge, sizeof(challenge), "%08lu", random(0, 99999999));
  // Compute HMAC-SHA-256 of the challenge
  uint8_t hmac[HASH_SIZE];
  sha256.resetHMAC(SECRET_KEY, strlen(SECRET_KEY));
  sha256.update(challenge, strlen(challenge));
  sha256.finalizeHMAC(SECRET_KEY, strlen(SECRET_KEY), hmac, HASH_SIZE);

  // Convert HMAC to hex string for comparison
  char hmacHex[HASH_SIZE * 2 + 1];
  for (int i = 0; i < HASH_SIZE; i++) {
    sprintf(hmacHex + i * 2, "%02x", hmac[i]);
  }
  hmacHex[HASH_SIZE * 2] = '\0';
  SerialBT.println(challenge);

  unsigned long start = millis();
  String response = "";
  while (millis() - start < BT_AUTH_TIMEOUT_MS && !response.endsWith("\n")) {
    if (SerialBT.available()) {
      response += (char)SerialBT.read();
    }
  }
  response.trim();
  Serial.println(response);

  if (response == hmacHex) {
    return true;
  } else {
    SerialBT.disconnect();
    return false;
  }
}

void clear_table() {
#if SCREEN_CONNECTED
  Data.begin(DATA_STORAGE_NAME, false);  // false = nie w trybie tylko do odczytu
  String clearFlag = Data.getString("clear_table", "0");

  if (clearFlag == "1") {
    // Ustal maksymalne wymiary do czyszczenia
    int maxCols = Data.getString("1x", "10").toInt();
    int maxRows = Data.getString("1y", "8").toInt();
    maxCols = 8;
    maxRows = 10;

    // Czyszczenie komórek danych
    for (int row = 0; row < maxRows; row++) {
      for (int col = 0; col < maxCols; col++) {
        String key = "1" + String(col + 1) + String(row + 1);
        Data.remove(key.c_str());
      }
    }

    // Czyszczenie nagłówków kolumn
    for (int col = 0; col < maxCols; col++) {
      String key = "1hC" + String(col + 1);
      Data.remove(key.c_str());
    }

    // Czyszczenie nagłówków wierszy
    for (int row = 0; row < maxRows; row++) {
      String key = "1hR" + String(row + 1);
      Data.remove(key.c_str());
    }

    // Resetowanie flagi
    Data.putString("clear_table", "0");
  }

  Data.end();
#endif
}

void clear_screen0() {
#if SCREEN_CONNECTED
  Data.begin(DATA_STORAGE_NAME, false);  // false = tryb do zapisu
  String clearFlag = Data.getString("clear_screen0", "0");

  if (clearFlag == "1") {
    // Usuń dane ekranowe
    Data.remove("01");  // room
    Data.remove("02");  // name
    Data.remove("03");  // phone
    Data.remove("04");  // email

    // Resetuj flagę
    Data.putString("clear_screen0", "0");
  }

  Data.end();
#endif
}