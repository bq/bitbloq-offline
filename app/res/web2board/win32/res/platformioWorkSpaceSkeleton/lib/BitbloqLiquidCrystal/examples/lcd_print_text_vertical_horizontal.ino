#include <BitbloqLiquidCrystal.h>


/***   Global variables and function definition  ***/
LiquidCrystal lcd(0);


String message_lcd = "To be or not to be-that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take arms against a sea of troubles, And, by opposing, end them.";

/***   Setup  ***/
void setup() {
Serial.begin(9600);
  lcd.begin(16, 2);
  lcd.clear();
  lcd.setCursor(0, 0);

  //Write the text along the lines of the LCD in correct order
  //lcd.printTextVertical(message_lcd, 500, false);

  //Write the text along the lines of the LCD in correct order and without cutting words between lines
  //lcd.printTextVertical(message_lcd, 500, true);

  //Write the text in one line, with horizontal scrolling
  lcd.printTextHorizontal(message_lcd, 200);



}

void loop() {
}
