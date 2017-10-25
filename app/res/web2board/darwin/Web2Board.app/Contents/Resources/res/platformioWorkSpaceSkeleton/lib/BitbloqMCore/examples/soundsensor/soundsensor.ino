#include <BitbloqMCore.h>

const int soundsensorpin = BitbloqMCore::ports[3][2];

void setup() {
  pinMode(soundsensorpin,INPUT);
  Serial.begin(9600);
}

void loop() {
  int sound = analogRead(soundsensorpin);
  Serial.println(sound);
  delay(1000);
  // put your main code here, to run repeatedly:

}
