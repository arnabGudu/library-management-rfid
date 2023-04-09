#include <SPI.h>
#include <MFRC522.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>

constexpr uint8_t RST_PIN = D3, SS_PIN = D8;

MFRC522 rfid(SS_PIN, RST_PIN);

MFRC522::MIFARE_Key key;

String tag;

void setup() {
  Serial.begin(9600);
  SPI.begin();
  rfid.PCD_Init();

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
  if (rfid.PICC_IsNewCardPresent()) {
    if (rfid.PICC_ReadCardSerial()) {
      for (byte i = 0; i < 4; i++) {
        tag += rfid.uid.uidByte[i];
      }
      httpRequest("EI1001", tag);
      Serial.print("tag: ");
      Serial.println(tag);
      tag = "";
      rfid.PICC_HaltA();
      rfid.PCD_StopCrypto1();
    }
  }
}
