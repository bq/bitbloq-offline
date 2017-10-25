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

class BitbloqMe4ButtonPad
{
public:
	BitbloqMe4ButtonPad(char pin);
	void setup() const;
	int read() const;

private:
	const char _pin;
	const int _values[5];
	int _threshold[4];
};

#endif //BUTTONPAD_H
