#include <BitbloqButtonPad.h>
#include <BitbloqMPort.h>
#include <BitbloqMCore.h>

const int dataPin = BitbloqMCore::ports[3][2]; 

BitbloqMe4ButtonPad pad(dataPin);

void setup() {
  pad.setup();
  Serial.begin(9600); 
}

void loop() {
  Serial.println(pad.read());
  delay(2000);
}
