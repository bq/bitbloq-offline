#include "Arduino.h"

/***   Included libraries  ***/


/***   Global variables and function definition  ***/
int boton_0 = 11;

/***   Setup  ***/
void setup(){pinMode(boton_0, INPUT);}

/***   Loop  ***/
void loop(){float boton = digitalRead(11);}