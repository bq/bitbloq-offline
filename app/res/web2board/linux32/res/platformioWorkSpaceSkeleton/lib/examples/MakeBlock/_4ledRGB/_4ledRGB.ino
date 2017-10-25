#include <BitbloqCompass.h>

#include <BitbloqAuriga.h>
 

BitbloqMeRGBLed ledRGB(BitbloqAuriga::ports[10][1],4);

void setup() {
  //ledRGB.setup();
  
}

void loop() {
  ledRGB.setColor(3,100,10,10);
  ledRGB.show();
}
