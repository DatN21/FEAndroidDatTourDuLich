export interface BookingDetailDTO {
  id: number;
  bookingId: number;
  tourScheduleId: number;
  fullName: string;
  gender: string;
  birthDate: string; // ISO string format
  ageGroupId: number;
  pricePerPerson: number;
}

export interface BookingDetailResponseByBookingId {
  customerName: string;
  phone: string;
  amount: number;
  tourEndDate: string; // định dạng dd/MM/yyyy
  bookingDetails: BookingDetailDTO[];
  startDate: string; // ISO string format
  endDate: string;
  note: string | null;
  method: string;
  price: string;
}
