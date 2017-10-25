/**In this example, components that are plugged to the MCore Board
 * are self-managed. Not using the MBot class.
 * This is the way to do it when you plug MakeBlock components to the MCore board 
 * which are not part of the out-of-the-box robot.
 */

#include <BitbloqMBot.h>
#include <BitbloqMCore.h>
const int irDer = BitbloqMCore::ports[2][1];
const int irIzq = BitbloqMCore::ports[2][2];
const int usTrigger = BitbloqMCore::ports[4][2];
const int usEcho = BitbloqMCore::ports[4][2];

BitbloqUltrasound us(usTrigger,usEcho);
BitbloqMBot mbot;

void setup() {
  // put your setup code here, to run once:
  mbot.setup();
  us.setup();
  pinMode(irDer,INPUT);
  pinMode(irIzq,INPUT);
  Serial.begin(9600);
}

void loop() {

  //Check Button
  Serial.print("Button Status (1-pushed): ");
  Serial.println(mbot.isButtonPushed());
  
  //Check Buzzer
  if (mbot.isButtonPushed()){
      mbot.playTone(200,100);
  }
  
  //Check LDR
  Serial.print("LDR value: ");
  Serial.println(mbot.readLightSensor());
  
  
  //Check Line Follower
  Serial.print("right line follower: ");
  Serial.println(digitalRead(irDer));
  Serial.print("left line follower: ");
  Serial.println(digitalRead(irIzq));

  //Check US
  Serial.print("US sensor (distance in cm): ");
  Serial.println(us.readDistanceInCM());

  //Check DC Motor
  if(mbot.isButtonPushed()){
    mbot.setRightMotorSpeed(200);
    mbot.setLeftMotorSpeed(200);
  }else{
    mbot.setRightMotorSpeed(0);
    mbot.setLeftMotorSpeed(0);
  } 

  //Check RGBLeds
  mbot.setLed(0,255,255,255);
  
  delay(1000);  

}


