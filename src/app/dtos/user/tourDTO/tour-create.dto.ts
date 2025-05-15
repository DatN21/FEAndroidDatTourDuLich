export class TourCreateDTO {
  tourName: string;
  duration: number;
  price: number;
  status?: string;
  // thumbnail?: string;
  description?: string;
  departureLocation?:string ;
imageHeader?:string ;

  // Constructor
  constructor(
    tourName: string,
    duration: number,
    price: number,
    status?: string,
    description?: string,
    departureLocation?: string,
    imageHeader?: string,
  ) {
    this.tourName = tourName;
    this.duration = duration;
    this.price = price;
    this.status = status;
    this.description = description;
    this.departureLocation = departureLocation;
    this.imageHeader = imageHeader;
  }
}
