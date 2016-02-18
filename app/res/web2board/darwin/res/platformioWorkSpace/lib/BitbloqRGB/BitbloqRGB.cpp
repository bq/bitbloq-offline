#include "BitbloqRGB.h"

//****** ZumRGB ******//
ZumRGB::ZumRGB(int redPin,int greenPin,int bluePin){
    _wait = 10;
    _redPin = redPin;
    _greenPin = greenPin;
    _bluePin = bluePin;
  
    pinMode(_redPin,OUTPUT);
    pinMode(_greenPin,OUTPUT);
    pinMode(_bluePin,OUTPUT);

    _R = 0;
    _G = 0;
    _B = 0;
    ZumRGB::setRGBWait(2);
  
}


void ZumRGB::setRGBcolor(int redValue,int greenValue,int blueValue){
    
    _R = redValue;
    _G = greenValue;
    _B = blueValue;

    analogWrite(_redPin, _R);
    analogWrite(_greenPin, _G);
    analogWrite(_bluePin, _B);
    delay(_wait); // Pause for optional '_wait' milliseconds before resuming the loop
}

// void ZumRGB::setRGBcolor(int color[3]){
    
//     _R = color[0];
//     _G = color[1];
//     _B = color[2];

//     analogWrite(_redPin, _R);
//     analogWrite(_greenPin, _G);
//     analogWrite(_bluePin, _B);
//     //delay(_wait); // Pause for optional '_wait' milliseconds before resuming the loop
// }

void ZumRGB::setRGBWait(int newWait){
    
    _wait = newWait;
    
}


void ZumRGB::crossFade(int redValue,int greenValue,int blueValue){


  int stepR = ZumRGB::calculateStep(_R, redValue);
  int stepG = ZumRGB::calculateStep(_G, greenValue); 
  int stepB = ZumRGB::calculateStep(_B, blueValue);

  for (int i = 0; i <= 1020; i++) {
    _R = ZumRGB::calculateVal(stepR, _R, i);
    _G = ZumRGB::calculateVal(stepG, _G, i);
    _B = ZumRGB::calculateVal(stepB, _B, i);

     analogWrite(_redPin, _R);
     analogWrite(_greenPin, _G);
     analogWrite(_bluePin, _B);

    delay(_wait); // Pause for '_wait' milliseconds before resuming the loop

  }
}










/* ////BASED IN TUTORIAL CODE: 
*         http://www.arduino.cc/en/Tutorial/ColorCrossfader
*
* 
* BELOW THIS LINE IS THE MATH -- YOU SHOULDN'T NEED TO CHANGE THIS FOR THE BASICS
* 
* The program works like this:
* Imagine a crossfade that moves the red LED from 0-10, 
*   the green from 0-5, and the blue from 10 to 7, in
*   ten steps.
*   We'd want to count the 10 steps and increase or 
*   decrease color values in evenly stepped increments.
*   Imagine a + indicates raising a value by 1, and a -
*   equals lowering it. Our 10 step fade would look like:
* 
*   1 2 3 4 5 6 7 8 9 10
* R + + + + + + + + + +
* G   +   +   +   +   +
* B     -     -     -
* 
* The red rises from 0 to 10 in ten steps, the green from 
* 0-5 in 5 steps, and the blue falls from 10 to 7 in three steps.
* 
* In the real program, the color percentages are converted to 
* 0-255 values, and there are 1020 steps (255*4).
* 
* To figure out how big a step there should be between one up- or
* down-tick of one of the LED values, we call calculateStep(), 
* which calculates the absolute gap between the start and end values, 
* and then divides that gap by 1020 to determine the size of the step  
* between adjustments in the value.
*/

int ZumRGB::calculateStep(int prevValue, int endValue) {
  int step = endValue - prevValue; // What's the overall gap?
  if (step) {                      // If its non-zero, 
    step = 1020/step;              //   divide by 1020
  } 
  return step;
}

/* The next function is calculateVal. When the loop value, i,
*  reaches the step size appropriate for one of the
*  colors, it increases or decreases the value of that color by 1. 
*  (R, G, and B are each calculated separately.)
*/

int ZumRGB::calculateVal(int step, int val, int i) {

  if ((step) && i % step == 0) { // If step is non-zero and its time to change a value,
    if (step > 0) {              //   increment the value if step is positive...
      val += 1;           
    } 
    else if (step < 0) {         //   ...or decrement it if step is negative
      val -= 1;
    } 
  }
  // Defensive driving: make sure val stays in the range 0-255
  if (val > 255) {
    val = 255;
  } 
  else if (val < 0) {
    val = 0;
  }
  return val;
}
