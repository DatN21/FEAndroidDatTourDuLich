export interface TourScheduleResponse {
    id: number;
    tourId: string;
    startDate: string;
    endDate: string;
    totalSlots: string;
    availableSlots: number;
    bookedSlots: string;
    status: string;
}