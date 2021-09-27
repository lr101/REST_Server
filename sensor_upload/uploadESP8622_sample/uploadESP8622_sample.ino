#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>


//Define GPIO pin D2 as Data-pin
#define ONE_WIRE_BUS 4
  
// Setup a oneWire instance to communicate with any OneWire devices 
OneWire oneWire(ONE_WIRE_BUS);

// Pass our oneWire reference to Dallas Temperature. 
DallasTemperature sensors(&oneWire);

// Number of temperature devices found
int numberOfDevices;

//store a found device address
DeviceAddress tempDeviceAddress; 

//Wifi Name and Psw
const char* ssid = "WIFI_NAME"; //TODO
const char* password = "WIFI_PSW"; //TODO

//Server IP Address
String host = "[HOST_IP]:3000"; //TODO

void setup() {
  /*
   * Setup WiFi-Connection
   **/
  Serial.begin(9600);
  delay(100);
 
  //Connect to WiFi verbinden
  Serial.print("Connect to Wifi: "); 
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  //trying to connect
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  //Wifi connected
  Serial.println("");
  Serial.println("WiFi connected");
 

  // Print the IP address
  Serial.print("IP Address: ");
  Serial.print("http://");
  Serial.print(WiFi.localIP());
  Serial.println("/");

  /*
   * Setup Thermometers
   * Send Thermometer serial number to server to setup db
   **/
   
  // Start up the library
  sensors.begin();
  
  // Grab a count of devices on the wire
  numberOfDevices = sensors.getDeviceCount();

  //Send to Server
   for(int i=0;i<numberOfDevices; i++){
    // Search the wire for address
    if(sensors.getAddress(tempDeviceAddress, i)){
      //adress
      String sensor = printAddress(tempDeviceAddress);

      /**
       * POST sensor serial numbers to webServer
       **/
      WiFiClient client;
      HTTPClient http;
      
      //Connect to WebServer:
      if (http.begin(client, "http://" + host + "/sensors/id/")){
        // we are connected to the host!
        http.addHeader("Content-Type", "application/json");
        int httpCode = http.POST("{\"sensorID\":\"" + sensor +"\",\"sensorNick\":\"newSensor\"}");                                  //Send the request
     
        if (httpCode > 0) { //Check the returning code
          Serial.println("Status Code changed");
          if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
              String payload = http.getString();
              Serial.println(payload);
          }
        } else {
          Serial.printf("[HTTP] GET... failed, error: %s", http.errorToString(httpCode).c_str());
        }
      } else {
        // connection failure
        Serial.println("Connection failure");
      }
      http.end();   //Close connection
    }
   }
}

void loop() {
  // put your main code here, to run repeatedly:
  /**
   * Read Temperatur:
   **/

   sensors.requestTemperatures(); // Send the command to get temperatures
  
  // Loop through each device, print out temperature data
  for(int i=0;i<numberOfDevices; i++){
    // Search the wire for address
    if(sensors.getAddress(tempDeviceAddress, i)){
      //adress and temp
      float tempC = 0;
      for (int y=0; y<20;y++) {
         tempC += sensors.getTempC(tempDeviceAddress);
         delay(500);
      }
      tempC = tempC / 20;
      String sensor = printAddress(tempDeviceAddress);
       /**
       * Send temp to server via http POST
       **/
      WiFiClient client;

      HTTPClient http;
      //Connect to WebServer:
      if (http.begin(client, "http://" + host + "/sensors/" + sensor + "/")){
        // we are connected to the host!
        http.addHeader("Content-Type", "application/json");
        int httpCode = http.POST("{\"value\":\"" + (String)tempC + "\",\"date\":\"noValue\"}");                                  //Send the request
     
        if (httpCode > 0) { //Check the returning code
          if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
              String payload = http.getString();
          }
        } else {
          Serial.printf("[HTTP] GET... failed, error: %s", http.errorToString(httpCode).c_str());
        }
      } else {
        // connection failure
        Serial.println("Connection failure");
      }
      http.end();   //Close connection
      
    }
  } 
}

// function to print a device address
String printAddress(DeviceAddress deviceAddress) {
  String adress;
  for (uint8_t i = 0; i < 8; i++)
  {
    if (deviceAddress[i] < 0x10) {
      adress += "0";
    }
    adress += decToHexa(deviceAddress[i]);
  }
 
  return adress;
}


//function to calculate sensor serial number from dec to hex
String decToHexa(int n)
{
    // char array to store hexadecimal number
    char hexaDeciNum[100];
 
    // counter for hexadecimal number array
    int i = 0;
    while (n != 0) {
        // temporary variable to store remainder
        int temp = 0;
 
        // storing remainder in temp variable.
        temp = n % 16;
 
        // check if temp < 10
        if (temp < 10) {
            hexaDeciNum[i] = temp + 48;
            i++;
        }
        else {
            hexaDeciNum[i] = temp + 55;
            i++;
        }
 
        n = n / 16;
    }
    String hex;
    // printing hexadecimal number array in reverse order
    for (int j = i - 1; j >= 0; j--)
        hex += hexaDeciNum[j];

    return hex;
}
