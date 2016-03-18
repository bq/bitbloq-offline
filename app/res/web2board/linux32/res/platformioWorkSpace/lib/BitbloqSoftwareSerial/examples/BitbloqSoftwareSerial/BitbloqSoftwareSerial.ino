#include <SoftwareSerial.h>
#include <bqSoftwareSerial.h>

#include <Servo.h>
#include <Wire.h>

bqSoftwareSerial bluetoothSerial(0,1,9600);

void setup()
{}

void loop()
{
  String a = bluetoothSerial.readString();
  if ( a != ""){
    bluetoothSerial.println("-->"+a);
  }
}
