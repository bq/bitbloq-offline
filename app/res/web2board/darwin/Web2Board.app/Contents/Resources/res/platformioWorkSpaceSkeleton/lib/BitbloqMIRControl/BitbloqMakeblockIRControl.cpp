/*
 * MakeblockBitbloqIRControl.cpp
 *
 * Copyright 2017 Alberto Valero <avalero.valero@bq.com>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 *
 *
*/

#include "BitbloqMakeblockIRControl.h"

namespace Bitbloq{

MakeblockIRControl::MakeblockIRControl(int pin):
	IRControl(pin)
{}

char MakeblockIRControl::getInfraredControlCommand(){
	IRrecv _InfraredReceiveCommand(receiverPin);
    _InfraredReceiveCommand.enableIRIn();
    while(1)
    {
        if(_InfraredReceiveCommand.decode(&_InfraredControlCommand))
        {
            _InfraredControlCommand2=_InfraredControlCommand.value;
            if(_InfraredControlCommand2>0xFD00FE&&_InfraredControlCommand2<0xFDB050)
            {
                _InfraredControlCommand1=_InfraredControlCommand2;
            }
            switch(_InfraredControlCommand2)
            {
				case -260652741:
                return 'L'; //left
                break;

				case -439370369:
                return 'R'; //right
                break;

				case -1547112997:
                return 'S'; //OK
                break;

				case -1056840325:
                return '0';
                break;

				case -1760117185:
                return '1';
                break;

				case 1033561079:
                return '2';
                break;

				case 1635910171:
                return '3';
                break;

				case -1943902853:
                return '4';
                break;

				case 1217346747:
                return '5';
                break;

				case 71952287:
                return '6';
                break;

				case 851901943:
                return '7';
                break;

				case 465573243:
                return '8';
                break;

				case 1053031451:
                return '9';
                break;


				case -672642277:
				return 'U';
				break;

				case -1756873733:
				return 'G';
				break;

				case -484956645:
				return 'A';
				break;

				case 5316027:
				return 'B';
				break;

				case -293048961:
				return 'C';
				break;

				case 1386468383:
				return 'D';
				break;

				case 553536955:
				return 'E';
				break;

				case -255584701:
				return 'F';
				break;

                default:
                return 'T';
                break;
            }
        }
    }
}

}//end namespace
