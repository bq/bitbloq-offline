#include <BitbloqAuriga.h>

#include <BitbloqMeLEDMatrixData.h>
#include <BitbloqMeLEDMatrix.h>

  

BitbloqMeLEDMatrix ledMatrix(BitbloqAuriga::ports[10][1],BitbloqAuriga::ports[10][2]);

void setup() {
  ledMatrix.setup();
}

void loop() {
  // put your main code here, to run repeatedly:

  ledMatrix.clearScreen();

  //ledMatrix.drawLed(1,0,1);
  for (int i=1; i<=16; i++){
    if(i>8)
      ledMatrix.drawLed(i,17-i,true);
    else
      ledMatrix.drawLed(i,i,true);
    delay(100);
  }

  ledMatrix.clearScreen();

  ledMatrix.drawRectangle(2,1,5,7);
  delay(1000);

  ledMatrix.drawLine(16,0,0,8);
  delay(1000);

  ledMatrix.drawCircumference(8,4,4);
  delay(1000);
}
