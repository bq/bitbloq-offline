#include <Wire.h>
#include <BitbloqLiquidCrystal.h>
LiquidCrystal lcd_1(0);
void setup() {
   lcd_1.begin(16, 2);
   lcd_1.clear();
   lcd_1.print("Hola!");
}

/***   Loop  ***/
void loop() {}