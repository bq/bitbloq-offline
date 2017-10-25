#include <BitbloqMCore.h>

const int pot = BitbloqMCore::ports[4][2]; //pot connected at port 4

void setup() {
  Serial.begin(9600);
  pinMode(pot,INPUT); // set potentiometer pin as input
}

void loop() {
  int pot_read = analogRead(pot); //read pot value
  Serial.print("Potentiometer read: ");
  Serial.println(pot_read);
  delay(1000);

}
