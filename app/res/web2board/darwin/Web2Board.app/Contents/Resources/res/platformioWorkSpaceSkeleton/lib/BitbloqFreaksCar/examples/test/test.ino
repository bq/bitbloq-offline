#include <IRremoteInt.h>
#include <IRremote.h>
#include <BitbloqElecFreaksIRControl.h>
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
  if (robot.readEndStop() == LOW){
      robot.playTone(200,100);
      robot.move(1,100);
  }
    
    Serial.print("LDR Derecha: ");
    Serial.println(robot.readLDRRight());
    Serial.print("LDR Izqda: ");
    Serial.println(robot.readLDRLeft());
    
    for(int i=0; i<5; i++){
      Serial.println(robot.readIR(i));
    }    
    delay(1000);
}
