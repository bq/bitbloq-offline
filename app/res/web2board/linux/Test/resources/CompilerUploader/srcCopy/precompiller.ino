/***   Included libraries  ***/
#include <SoftwareSerial.h>
#include <BitbloqSoftwareSerial.h>
#include <BitbloqEncoder.h>


/***   Global variables and function definition  ***/
Encoder encoder_0(encoderUpdaterWrapper, 6, 3, 2);
bqSoftwareSerial puerto_serie_0(0, 1, 9600);

/***   Setup  ***/
void setup() {}

/***   Loop  ***/
void loop() {}
void encoderUpdaterWrapper() {
    encoder_0.update();
}