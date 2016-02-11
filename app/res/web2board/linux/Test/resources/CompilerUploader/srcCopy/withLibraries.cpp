/***   Included libraries  ***/
#include "Arduino.h"
#include <BitbloqUS.h>
#include <Servo.h>


/***   Global variables and function definition  ***/
int led_0 = 13;
US ultrasonidos_0(5, 2);

/***   Setup  ***/
void setup() {
    pinMode(led_0, OUTPUT);
}

/***   Loop  ***/
void loop() {
// turn the LED on (HIGH is the voltage level)
  digitalWrite(LED_BUILTIN, HIGH);
  // wait for a second
  delay(1);
  // turn the LED off by making the voltage LOW
  digitalWrite(LED_BUILTIN, LOW);
   // wait for a second
  delay(30);
}