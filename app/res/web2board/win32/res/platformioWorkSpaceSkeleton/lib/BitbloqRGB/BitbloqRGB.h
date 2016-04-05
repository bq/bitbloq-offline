

#ifndef ZUMRGB_H
#define ZUMRGB_H
#include "Arduino.h"

class ZumRGB
{
  public:
    ZumRGB(int redPin,int greenPin,int bluePin);

    void setRGBcolor(int redValue,int greenValue,int blueValue);
    //void setRGBcolor(int color[3]);

    void setRGBWait(int newWait);

    void crossFade(int redValue,int greenValue,int blueValue);
    //void crossFade(int color[3]);

    
  private:
    int _redPin;
    int _greenPin;
    int _bluePin;

    int _R;
    int _G;
    int _B;

    int _wait; // 10ms internal delay. Increase for slower fades

    int calculateStep(int prevValue, int endValue);
    int calculateVal(int step, int val, int i);
};

#endif //ZUMRGB_H