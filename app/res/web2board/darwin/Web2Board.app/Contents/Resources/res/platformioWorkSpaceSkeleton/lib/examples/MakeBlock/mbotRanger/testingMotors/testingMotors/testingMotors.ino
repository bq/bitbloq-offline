#include <BitbloqMBotRanger.h>

BitbloqMBotRanger ranger(6,7);

void setup() {
  // put your setup code here, to run once:
  ranger.setup();
  Serial.begin(9600);

}

void loop() {
    
  //Check DC Motor

  //forward
  ranger.move(1,100);
  delay(5000);

  //backward
  ranger.move(2,100);
  delay(5000);

  //left
  ranger.move(3,100);
  delay(5000);

  //right
  ranger.move(4,100);
  delay(5000);

  //stop
  ranger.move(1,0);
  delay(5000);

  for (int i= 0; i < 250; i++){
    ranger.setRightMotorSpeed(i);
    delay(50);
  }

  for (int i= 250; i > -250; i--){
    ranger.setRightMotorSpeed(i);
    delay(50);
  }

  for (int i= -250; i < 0; i++){
    ranger.setRightMotorSpeed(i);
    delay(50);
  }

  delay(1000);

  for (int i= 0; i < 250; i++){
    ranger.setLeftMotorSpeed(i);
    delay(50);
  }

  for (int i= 250; i > -250; i--){
    ranger.setLeftMotorSpeed(i);
    delay(50);
  }

  for (int i= -250; i < 0; i++){
    ranger.setLeftMotorSpeed(i);
    delay(50);
  }

  delay(1000);

  
 
}


