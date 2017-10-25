//#include <Wire.h>
#include <BitbloqAuriga.h>


BitbloqAuriga auriga; //declare auriga board

void setup() {
  auriga.setup();
  Serial.begin(9600);

}

void loop() {
  //power status 0 (powered off)  1 (powered on)
  Serial.print("Power Status: ");
  Serial.println(auriga.readPowerStatus());
  
  //temp (the lesser the hotter)
  Serial.print("Temp: ");
  Serial.println(auriga.readTemperature());
  
  //sound (the greater the louder)
  Serial.print("Sound: ");
  Serial.println(auriga.readSoundLevel());

  //Gyroscope
  Serial.print("X: ");
  Serial.println(auriga.getAngleX());

  Serial.print("Y: ");
  Serial.println(auriga.getAngleY());

  Serial.print("Z: ");
  Serial.println(auriga.getAngleZ());

  delay(1000);
}
