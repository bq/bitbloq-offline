/*
 * ElecfreaksBitbloqIRControl.cpp
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

#include "BitbloqElecFreaksIRControl.h"

namespace Bitbloq{

ElecfreaksIRControl::ElecfreaksIRControl(int pin):
	IRControl(pin)
{}

char ElecfreaksIRControl::getInfraredControlCommand(){
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
     			case 0xFDA05F: //up
					case -1497820227:
    			return 'F';
    			break;

      			case 0xFDB04F: //down
						case 1113853081:
      			return 'D';
      			break;

      			case 0xFD10EF: //left
						case 32049505:
      			return 'L';
      			break;

      			case 0xFD50AF: //right
						case -885166211:
      			return 'R';
      			break;

      			case 0xFD906F: //ok
						case -1839375523:
		   	 	return 'S';
     			break;


											case -799895003: //return
					      			return 'X';
					      			break;

				case 0xFD708F:
				case 1811778305:
				return '0';
				break;

				case 0xFD08F7:
				case -555408703:
				return '1';
				break;

				case 0xFD8877:
				case 1868133565:
				return '2';
				break;

				case 0xFD48B7:
				case -1737510107:
				return '3';
				break;

				case 0xFD28D7:
				case -875377411:
				return '4';
				break;

				case 0xFDA857:
				case 629155073:
				return '5';
				break;

				case 0xFD6897:
				case -2048877215:
				return '6';
				break;

				case 0xFD18E7:
				case -949029659:
				return '7';
				break;

				case 0xFD9867:
				case 1474512609:
				return '8';
				break;

				case 0xFD58A7:
				case -1866245375:
				return '9';
				break;

				case 0xFD20DF:
				case 373604801:
				return '+';
				break;

				case 0xFD30CF:
				case -1309689187:
				return '-';
				break;

				case 0xFD609F:
				return 'B';
				break;

				case 0xFD40BF: //menu
				case 46690913:
				return 'M';
				break;

				case 0xFD00FF: //on-off
				case -1292968131:
				return 'P';
				break;

				default:
				return 'T';
				break;

    		}
        }
    }
}

}//end namespace
