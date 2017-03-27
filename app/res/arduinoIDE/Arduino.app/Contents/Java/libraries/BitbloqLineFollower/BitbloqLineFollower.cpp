#include "BitbloqLineFollower.h"
//****** LINEFOLLOWER ******//
LineFollower::LineFollower(int pinLeft, int pinRight){
	LineFollower::init(pinLeft,pinRight);
}

void LineFollower::init(int pinLeft, int pinRight){
  _pinLeft = pinLeft;
  _pinRight = pinRight;
  pinMode(pinLeft,INPUT);
  pinMode(pinRight,INPUT);
}

float * LineFollower::read(){
  float * position = (float*)malloc(2*sizeof(float));
  position[0] = (float) LineFollower::readLeftSensor();
  position[1] = (float) LineFollower::readRightSensor();
  return position;
}

// int * LineFollower::read(){
//   int * position = (int *)malloc(2*sizeof(int));
//   position[0] = LineFollower::readLeftSensor();
//   position[1] = LineFollower::readRightSensor();
//   return position;
// }

int LineFollower::readLeftSensor(){
  return digitalRead(_pinLeft);
}
int LineFollower::readRightSensor(){
  return digitalRead(_pinRight);
}