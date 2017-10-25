#include <BitbloqMCore.h>


const int modePin = BitbloqMCore::ports[3][1];
const int sensorPin = BitbloqMCore::ports[3][2];

void setup() {
  pinMode(modePin,OUTPUT);
  pinMode(sensorPin,INPUT);
  Serial.begin(9600);
  digitalWrite(modePin,1); //in order to detect motion multiple times (0 only detects one time)
}

void loop() {
  if(digitalRead(sensorPin)){
    Serial.println("Motiooonn!!");
  }
  delay(20);
}
