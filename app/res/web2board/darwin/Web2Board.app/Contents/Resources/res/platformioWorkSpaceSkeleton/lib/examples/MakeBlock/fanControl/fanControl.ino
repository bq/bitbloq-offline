#include <BitbloqUS.h>
#include <BitbloqDCMotor.h>
#include <BitbloqAuriga.h>


const int dirPin = BitbloqAuriga::ports[7][2];
const int pwmPin = BitbloqAuriga::ports[7][1];

Bitbloq::DCMotor fan(dirPin,pwmPin);

void setup() {
  // put your setup code here, to run once:
  fan.setup();
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  fan.setSpeed(100);
  

  
}
