#include <ButtonPad.h>


#include <Servo.h>
#include <Wire.h>
#include <SoftwareSerial.h>

ButtonPad myPad(A0);

void setup(){
  Serial.begin(9600);
}
void loop(){
  Serial.println(String(myPad.read()));
}