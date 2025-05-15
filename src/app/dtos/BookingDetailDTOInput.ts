export interface BookingDetailDTO {
    fullName: string;
    gender: string;
    birthDate: string; // ISO string format
    ageGroupId: number;
    pricePerPerson: number;
}
export interface BookingDetailDTOInput {
  customerId: number;
  tourScheduleId: number;
  bookedSlots: number;
  fullName: string;
  phone: string;
  paymentMethod: string;
  email: string;
  address: string;
  note: string | null;
  details: BookingDetailDTO[];
}