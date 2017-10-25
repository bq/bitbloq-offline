#include <BitbloqCompass.h>

#include <BitbloqAuriga.h>
 

Bitbloq::Compass compass(BitbloqAuriga::ports[10][1],BitbloqAuriga::ports[10][2]);

void setup() {
  compass.setup();
  Serial.begin(9600);
  
}

void loop() {
  Serial.println(compass.getAngle());
  delay(1000);
}
