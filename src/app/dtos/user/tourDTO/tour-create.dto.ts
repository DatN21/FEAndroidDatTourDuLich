export class TourCreateDTO {
  tourName: string;
  days: number;
  startDate: Date;
  destination: string;
  departureLocation: string;
  price: number;
  tourType?: string;
  status?: string;
  // thumbnail?: string;
  description?: string;
  content?: string ;
  imageHeader?:string ;


  // Constructor
  constructor(
    tourName: string,
    days: number,
    startDate: Date,
    destination: string,
    departureLocation: string,
    price: number,
    tourType?: string,
    status?: string,
    // thumbnail?: string,
    description?: string,
    content?: string ,
    imageHeader?:string ,
  ) {
    this.tourName = tourName;
    this.days = days;
    this.startDate = startDate;
    this.destination = destination;
    this.departureLocation = departureLocation;
    this.price = price;
    this.tourType = tourType;
    this.status = status;
    // this.thumbnail = thumbnail;
    this.description = description ;
    this.content = content ;
    this.imageHeader = imageHeader ;
  }
}
