#include <SPI.h>
#include <MFRC522.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>
#define BUZZ_PIN D4

constexpr uint8_t RST_PIN1 = D2, RST_PIN2 = D1;
constexpr uint8_t SS_PIN1 = D8, SS_PIN2 = D3;

MFRC522 rfid1(SS_PIN1, RST_PIN1);
MFRC522 rfid2(SS_PIN2, RST_PIN2);

MFRC522::MIFARE_Key key1, key2;

String tag1, tag2;

void setup() {
  Serial.begin(9600);
  SPI.begin();
  rfid1.PCD_Init();
  rfid2.PCD_Init();
  pinMode(BUZZ_PIN, OUTPUT);
  digitalWrite(BUZZ_PIN, HIGH);

  WiFi.begin("JioFiber-xDPSy", "gudusanu");
  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi Network");
}

void httpRequest(String type, String id) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    Serial.print("[HTTP] begin...\n");
    if (http.begin(client, "http://192.168.29.192:5000/" + type + "/id=" + id)) {
      Serial.print("[HTTP] GET...\n");
      int httpCode = http.GET();

      if (httpCode > 0) {
        Serial.printf("[HTTP] GET... code: %d\n", httpCode);

        if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
          String payload = http.getString();
          if (type == "gate" && payload == "ALERT") {
            digitalWrite(BUZZ_PIN, LOW);
            delay(5000);
            digitalWrite(BUZZ_PIN, HIGH);
          }
          Serial.println(payload);
        }
      } else {
        Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
      }
      http.end();
    }
    else {
      Serial.printf("[HTTP} Unable to connect\n");
    }
  }
}

void loop() {
  if (rfid1.PICC_IsNewCardPresent()) {
    if (rfid1.PICC_ReadCardSerial()) {
      for (byte i = 0; i < 4; i++) {
        tag1 += rfid1.uid.uidByte[i];
      }
      httpRequest("panel", tag1);
      Serial.print("tag1: ");
      Serial.println(tag1);
      tag1 = "";
      rfid1.PICC_HaltA();
      rfid1.PCD_StopCrypto1();
    }
  }
  if (rfid2.PICC_IsNewCardPresent())
  {
    if (rfid2.PICC_ReadCardSerial()) {
      for (byte i = 0; i < 4; i++) {
        tag2 += rfid2.uid.uidByte[i];
      }
      httpRequest("gate", tag2);
      Serial.print("tag2: ");
      Serial.println(tag2);
      tag2 = "";
      rfid2.PICC_HaltA();
      rfid2.PCD_StopCrypto1();
    }
  }
}
