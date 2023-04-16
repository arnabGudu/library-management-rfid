#include <SPI.h>
#include <MFRC522.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>

#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

#define WIFI_SSID "JioFiber-xDPSy"
#define WIFI_PASSWORD "gudusanu"

#define API_KEY "AIzaSyCK3l7fGHB1lRGA1UvBhXKBw5zk239Yw70"
#define DATABASE_URL "https://library-management-1a20f-default-rtdb.firebaseio.com/"

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

constexpr uint8_t RST_PIN = D3, SS_PIN = D8;

MFRC522 rfid(SS_PIN, RST_PIN);

MFRC522::MIFARE_Key key;

String tag, ip;

void setup() {
  Serial.begin(9600);
  SPI.begin();
  rfid.PCD_Init();

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi Network");

  // Firebase DDNS
  bool signupOK = false;
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("ok");
    signupOK = true;
  }
  else {
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  config.token_status_callback = tokenStatusCallback;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  if (Firebase.ready() && signupOK) {
    if (Firebase.RTDB.getString(&fbdo, "/ddns/server")) {
      ip = fbdo.stringData();
      Serial.println(ip);
    }
    else
      Serial.println(fbdo.errorReason());
  }
}

void httpRequest(String type, String id) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    Serial.print("[HTTP] begin...\n");
    if (http.begin(client, "http://" + ip + ":5000/" + type + "/id=" + id)) {
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
