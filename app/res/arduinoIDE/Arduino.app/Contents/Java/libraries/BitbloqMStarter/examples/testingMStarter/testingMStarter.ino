#include <BitbloqMOrion.h>
#include <BitbloqMStarter.h>

BitbloqMStarter mbot;

void setup() {
  // put your setup code here, to run once:
  mbot.setLineFollowerPort(2);
  mbot.setUSPort(5);
  mbot.setup();
  Serial.begin(9600);
}

void loop() {

  //Check Buzzer
  if (mbot.isButtonPushed()){
      mbot.playTone(200,100);
  }
  
  //Check Line Follower
  Serial.print("right line follower: ");
  Serial.println(mbot.readRightLineFollowerSensor());
  Serial.print("left line follower: ");
  Serial.println(mbot.readLeftLineFollowerSensor());

  //Check US
  Serial.print("US sensor (distance in cm): ");
  Serial.println(mbot.readUSMeasuredDistanceCM());

  //Check DC Motor
  if(mbot.isButtonPushed()){
    mbot.setRightMotorSpeed(200);
    mbot.setLeftMotorSpeed(200);
  }else{
    mbot.setRightMotorSpeed(0);
    mbot.setLeftMotorSpeed(0);
  } 

  delay(1000);  

}


