export interface BookingResponseByUser {
    id: number ;
    user_id: number ;
    amount: number ;
    status: string ;
    notes: string ;
    full_name : string ;
    phone_number: string ;
    tour_name: string; 
    code: string;
    start_date: Date ;
    total_price: string ;
    payment_method: string ;
    booking_time: Date;
}