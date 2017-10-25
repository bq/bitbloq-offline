#include "BitbloqLineFollower.h"
//****** LINEFOLLOWER ******//
LineFollower::LineFollower(int pinLeft, int pinRight){
  _pinLeft = pinLeft;
  _pinRight = pinRight;
}
int * LineFollower::read(){
  int * position = (int*)malloc(2*sizeof(int));
  position[0] = LineFollower::readLeftSensor();
  position[1] = LineFollower::readRightSensor();
  return position;
}
int LineFollower::readLeftSensor(){
  return digitalRead(_pinLeft);
}
int LineFollower::readRightSensor(){
  return digitalRead(_pinRight);
}