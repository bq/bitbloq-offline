/*
 * BitbloqMPort.h
 *
 * Copyright 2016 Alberto Valero <alberto.valero@bq.com>
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
 
 #ifndef BITBLOQMPORT
 #define BITBLOQMPORT
 
/**
 * Port struct for MakeBlock Boards
 */
class Port
{
	public:
	
	Port(int a, int b)
	{
		s1 = a;
		s2 = b;
	}	
	virtual ~Port(){}
	
	int s1, s2;
	
	const int operator[](size_t index) const{
		switch(index){
			case 1:
				return s1;
				break;
			case 2:
				return s2;
				break;
			default:
				return -1;
		}
	}
};
    
#endif
