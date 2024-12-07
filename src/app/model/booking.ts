import {Tour} from './tour'
export interface Booking {
    id: number ;
    full_name: string ;
    phone_number: string ;
    userId: number ;
    tour_name: string ;
    amount : number ;
    start_date: Date ;
    total_price: number; 
    status: string ;
    paymentMehod: string ;
    notes: string ;
    booking_time: Date;
}