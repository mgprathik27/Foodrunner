import {FoodQuant} from './foodQuant';

export class Order{
	_id		: string
  email		: string;
  totalAmt	: number;
  foods		: FoodQuant[];
  orderDate : Date;
};