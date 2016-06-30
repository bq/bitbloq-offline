#include "BitbloqSoftwareSerial.h"

String bqSoftwareSerial::readString(){
        String inString ="";
		char inChar;
		while(bqSoftwareSerial::available()>0){
			inChar =(char) bqSoftwareSerial::read();
			if (inChar=='='){
				inString="";
			}
			else if(inChar!='+'){
				inString+=inChar;
			}
	          delay(1);
		}
       
        return inString;
	}