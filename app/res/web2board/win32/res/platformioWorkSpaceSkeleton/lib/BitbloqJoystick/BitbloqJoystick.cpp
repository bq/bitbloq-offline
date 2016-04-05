#include "BitbloqJoystick.h"
//****** JOYSTICK ******//
Joystick::Joystick(float pinX, float pinY, float pinButton){
  _pinX = pinX;
  _pinY = pinY;
  _pinButton = pinButton;
}
float * Joystick::read(){
  float * position = (float*)malloc(3*sizeof(float));
  position[0] = Joystick::readPinX();
  position[1] = Joystick::readPinY();
  position[2] = Joystick::readPinButton();
  free (position);
  return position;
}
float Joystick::readPinX(){
  return analogRead(_pinX);
}
float Joystick::readPinY(){
  return analogRead(_pinY);
}
float Joystick::readPinButton(){
  return digitalRead(_pinButton);
}