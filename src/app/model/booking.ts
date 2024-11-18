import {Tour} from './tour'
export interface Booking {
    id: number ;
    user_id: number ;
    tour_id: Tour ;
    tour_name: string ;
    amount : number ;
    start_date: Date ;
    total_price: number; 
    status: string ;
    paymentMehod: string ;
    notes: string ;
    booking_time: Date;
}