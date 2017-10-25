#include <Bitbloq7SegmentDisplay.h>
#include <BitbloqMPort.h>
#include <BitbloqMCore.h>

const int dataPin = BitbloqMCore::ports[1][1]; 
const int clockPin = BitbloqMCore::ports[1][2]; 

Bitbloq7SegmentDisplay display(dataPin,clockPin);

void setup() {
  display.setup();

}

void loop() {
  for(int i= 0; i<9; i++){
    display.display((uint8_t)0,i);
    for (int j=0; j<9; j++){
      display.display((uint8_t)1,j);
      for (int k= 0; k<9; k++){
        display.display((uint8_t)2,k);
        for (int l= 0; l<9; l++){
          display.display((uint8_t)3,l);
          delay(250);
        }
      }
    }
  }
}
