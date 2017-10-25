#include "BitbloqButtonPad.h"

//****** BUTTONPAD ******//
ButtonPad::ButtonPad(int pin){
  _pin = pin;
  _num_keys = 5;
  _adc_key_val = (int*)malloc(_num_keys*sizeof(int));
  _adc_key_val[0] = 21;
  _adc_key_val[1] = 66;
  _adc_key_val[2] = 106;
  _adc_key_val[3] = 335;
  _adc_key_val[4] = 791;
  _key=-1;
  _oldkey=-1;
  _keys = (char*)malloc(5*sizeof(char));
  _keys[0]='A';
  _keys[1]='B';
  _keys[2]='C';
  _keys[3]='D';
  _keys[4]='E';
}
ButtonPad::ButtonPad(int pin, int num_keys, int * adc_key_val){
  _pin = pin;
  _num_keys = num_keys;
  _adc_key_val = adc_key_val;
}
int ButtonPad::readReturnNum(){
  int adc_key_in =analogRead(_pin);
  _key = get_key(adc_key_in);
  if (_key>=0)
  {
    return _key;
  }
    return -1;
}
char ButtonPad::read(){
  int adc_key_in =analogRead(_pin);
  _key = get_key(adc_key_in);
  if (_key>=0)
  {
    return _keys[_key];
  }
  return 0;
}
int ButtonPad::get_key(int input)
{
  int k;
  for (k = 0; k < _num_keys; k++)
  {
    if (input < _adc_key_val[k])
    {
      return k;
    }
  }
  return -1;
}

BitbloqMe4ButtonPad::BitbloqMe4ButtonPad(char pin):
	_pin(pin),
	_values{0, 489, 651, 733, 980}
{
	_threshold[0] = (_values[0]+_values[1])/2;
	_threshold[1] = (_values[1]+_values[2])/2;
	_threshold[2] = (_values[2]+_values[3])/2;
	_threshold[3] = (_values[3]+_values[4])/2;
}

void BitbloqMe4ButtonPad::setup() const{
	pinMode(_pin,INPUT);
}

int BitbloqMe4ButtonPad::read() const{
	int value = analogRead(_pin);
	if (value < _threshold[0]) return 1; //button 1 pressed
	else if (value < _threshold[1]) return 2; //button 2 pressed
	else if (value < _threshold[2]) return 3; //button 3 pressed
	else if (value < _threshold[3]) return 4; //button 4 pressed
	else return 0; //no button pressed
}
