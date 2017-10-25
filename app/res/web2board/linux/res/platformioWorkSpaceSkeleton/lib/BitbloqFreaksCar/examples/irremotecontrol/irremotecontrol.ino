#include <BitbloqIRControl.h>

#include <BitbloqFreaksCar.h>
#include <BitbloqUS.h>
#include <BitbloqDCMotor.h>

BitbloqFreaksCar robot;

void setup() {
  // put your setup code here, to run once:
  robot.setup();
  Serial.begin(9600); 
}

void loop() {
  Serial.println(robot.getInfraredControlCommand());
}
