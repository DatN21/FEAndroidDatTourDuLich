import {Tour} from './tour'
export interface Booking {
    bookingId: number ;
    phoneUser: string ;
    phoneTour: string ;
    address: string ;
    customerName: string ;
    customerEmail : string ;
    tourName: string ;
    createdAt: number ;
    bookedSlots: number ;
    status: string ;
    price: number ;
    note: string ;
}