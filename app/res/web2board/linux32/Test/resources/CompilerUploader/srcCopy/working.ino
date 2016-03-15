/*
 * Blink
 * Turns on an LED on for one second,
 * then off for one second, repeatedly.
 */

/*** Included libraries  ***/
#include <Wire.h>
#include <BitbloqLiquidCrystal.h>


/***   Global variables and function definition  ***/
LiquidCrystal lcd_1(0);

/***   Setup  ***/
void setup() {
   lcd_1.begin(16, 2);
   lcd_1.clear();
   lcd_1.print("Hola!");
}

/***   Loop  ***/
void loop() {}