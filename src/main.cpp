#include <Arduino.h>
#include <SmartHomeCore.h>

using namespace shCore;
String uartData = "";

void getUARTdata()
{
  sendToServer(200,"text/plain",uartData);
  uartData = "";
}
void sendDataToUART()
{
  String data = getFromServer("UARTdata");
  Serial.println(data);
}
void configUART()
{
    String UARTspeed = getFromServer("UARTspeed");
    setSerialSpeed(UARTspeed.toInt());
    uartData += String() + "<h6 class='codeText'style='color:#12b9d4'>UARTspeed: " + UARTspeed + "</h6>";
}

void setup() {
  setSSIDwifiAP("UART console :)");
  registrateEvent("/getUARTdata",getUARTdata);
  registrateEvent("/sendDataToUART",sendDataToUART);
  registrateEvent("/configUART",configUART);

  coreInit();
}

void loop() {
  coreHandle();
  if(Serial.available())
  {
    uartData += String() + "<h6 class='codeText'>" + Serial.readString() + "</h6>";
  }
}