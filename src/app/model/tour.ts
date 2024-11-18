export interface Tour{
    id: number ;
    tour_name: string ;
    days: number ;
    start_date: Date ;
    destination: string ;
    tour_type: string ;
    departure_location: string ;
    status : string ;
    price: Number ;
    // thumbnail : string ;
    // tour_images : TourImage[] ;
    description: string;
    content: string ;
    imageHeader : string;
}