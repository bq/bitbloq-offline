#include <ZumRGB.h>

const int redPin = 9;      // RGB red LED connected to digital pin 9
const int greenPin = 10;   // RGB green LED connected to digital pin 10
const int bluePin = 11;    // RGB blue LED connected to digital pin 11

int redValue = 0;          // value to write to the red LED
int greenValue = 0;        // value to write to the green LED
int blueValue = 0;         // value to write to the blue LED
 
//Create ZumRGB object to control the Zum RGB LED module
ZumRGB myRGB(redPin, greenPin, bluePin);

void setup() {
  
  // set the digital pins as outputs
  pinMode(redPin,OUTPUT);
  pinMode(greenPin,OUTPUT);
  pinMode(bluePin,OUTPUT);
  
  myRGB.setRGBWait(2); //2ms insted of 10ms

}

void loop() {
  
    
 //DARK BLACK:
  myRGB.setRGBcolor(1,1,1);
  delay(1000);   

  // Let's fade!
  myRGB.crossFade(100,1,1);
  delay(100);
  myRGB.crossFade(60,255,1);
  delay(100);
  myRGB.crossFade(1,1,255);
  delay(100);
  myRGB.crossFade(210,100,30);
  delay(100);
}
