#include <BitbloqFreaksCar.h>

BitbloqFreaksCar robot;

int speed = -100;
int stop = 0;

void setup() {
  // put your setup code here, to run once:
  robot.setup();
  Serial.begin(9600);
}

void loop() {
  if (robot.readEndStop() == LOW){
      for (int j=0; j<5; j++){
        for (int i=0; i<10;i++){
          speed = 254 - 25*i;
          Serial.println(speed);
          robot.move(j,speed);
          //robot.setRightMotorSpeed(255-speed);
          delay(2000);
        }
      }
      //robot.setRightMotorSpeed(speed);
      //robot.setLeftMotorSpeed(255-speed);
      
  }else{
    robot.move(0,0);
  }
     
}
