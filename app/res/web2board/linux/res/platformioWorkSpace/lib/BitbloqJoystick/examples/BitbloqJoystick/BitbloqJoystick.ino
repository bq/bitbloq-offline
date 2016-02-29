#include <Joystick.h>
#include <Wire.h>
#include <Servo.h>
#include <bqSoftwareSerial.h>
#include <SoftwareSerial.h>

Joystick myJoystick(A1,A2,4);

void setup(){
  Serial.begin(9600);
}
void loop(){
  float * joystick_position = myJoystick.read();
  Serial.print("\n------\nJoystick:\nX axis:");
  Serial.println(joystick_position[0]);
  Serial.print("\nY axis:");
  Serial.println(joystick_position[1]);
  Serial.print("\nButton:");
  Serial.println(joystick_position[2]);
  Serial.println("------");
  delay(500);
}