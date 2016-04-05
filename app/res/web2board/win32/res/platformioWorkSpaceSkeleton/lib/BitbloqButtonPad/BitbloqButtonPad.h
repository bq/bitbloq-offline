#ifndef BUTTONPAD_H
#define BUTTONPAD_H
#include "Arduino.h"

class ButtonPad
{
  public:
    ButtonPad(int pin);
    ButtonPad(int pin, int num_keys, int * adc_key_val);

    int readReturnNum();
    char read();
    
  private:
    int get_key(int input);
    int _pin;
    int _num_keys;
    int * _adc_key_val;
  int _key;
  int _oldkey;
  char * _keys;

};

#endif //BUTTONPAD_H