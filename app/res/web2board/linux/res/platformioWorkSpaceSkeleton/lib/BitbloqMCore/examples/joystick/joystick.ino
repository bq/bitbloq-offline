#include <BitbloqMCore.h>

const int x_pin = BitbloqMCore::ports[4][1]; //x axis at port 4
const int y_pin = BitbloqMCore::ports[4][2]; //y axis at port 4

void setup() {
  Serial.begin(9600);
  pinMode(x_pin,INPUT); // set x pin as input
  pinMode(y_pin,INPUT); // set y pin as input
}

void loop() {
  int x_read = analogRead(x_pin); //read x value
  int y_read = analogRead(y_pin); //read y value
  Serial.print("x: ");
  Serial.println(x_read);
  Serial.print("y: ");
  Serial.println(y_read);
  delay(1000);

}
