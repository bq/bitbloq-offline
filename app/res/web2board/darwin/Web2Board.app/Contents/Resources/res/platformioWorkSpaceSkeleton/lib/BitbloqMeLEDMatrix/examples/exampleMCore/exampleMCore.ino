#include <BitbloqMCore.h>

#include <BitbloqMPort.h>
#include <BitbloqMCore.h>

#include <BitbloqMeLEDMatrixData.h>
#include <BitbloqMeLEDMatrix.h>

const int SCK_Pin = BitbloqMCore::ports[1][1];
const int DIN_Pin = BitbloqMCore::ports[1][2];

BitbloqMeLEDMatrix ledMatrix(SCK_Pin,DIN_Pin);

String s = "Hi";

void setup() {
  ledMatrix.setup();
  ledMatrix.setBrightness(6);
  ledMatrix.setColorIndex(1);

}

void loop() {
   ledMatrix.showClock(12,03,1);
   delay(2000);
   
   ledMatrix.drawStr(0,7,s);
   delay(2000);
   ledMatrix.showNum(1.23);
   delay(2000);
}
