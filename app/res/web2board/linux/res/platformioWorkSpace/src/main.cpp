#include "Arduino.h"

/***   Included libraries  ***/
#include <BitbloqZowi.h>
#include <BitbloqUS.h>
#include <BitbloqBatteryReader.h>
#include <BitbloqLedMatrix.h>
#include <Servo.h>
#include <BitbloqOscillator.h>
#include <EEPROM.h>


/***   Global variables and function definition  ***/
Zowi zowi;

/***   Setup  ***/
void setup(){zowi.init();}

/***   Loop  ***/
void loop(){}