//#include <BitbloqMCore.h>
#include <BitbloqMBotRanger.h>

BitbloqMBotRanger mbot(6,7);

void setup() {
  // put your setup code here, to run once:
  mbot.setup();
  Serial.begin(9600);

}

void loop() {
  
  //Check Buzzer
  mbot.playTone(200,10);
  
  //Check LDR
  Serial.print("LDR Left value: ");
  Serial.println(mbot.readLightSensor(1));
  
  Serial.print("LDR Right value: ");
  Serial.println(mbot.readLightSensor(2));

  //testing sound
  Serial.print("Microphone: "); Serial.println(mbot.readSoundLevel());

  //testing temperature
  Serial.print("Temp (aRead(): "); Serial.println(mbot.readTemperature());

  
  //Check Line Follower
  Serial.print("right line follower: ");
  Serial.println(mbot.readRightLineFollowerSensor());
  Serial.print("left line follower: ");
  Serial.println(mbot.readLeftLineFollowerSensor());

  //Check US
  Serial.print("US sensor (distance in cm): ");
  Serial.println(mbot.readUSMeasuredDistanceCM());

  //Check DC Motor
  
  mbot.setRightMotorSpeed(200);
  mbot.setLeftMotorSpeed(200); 

  //Check RGBLeds
  mbot.setLed(0,10,10,10);

  delay(1000);
 
}


