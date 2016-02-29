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
  return NULL;
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