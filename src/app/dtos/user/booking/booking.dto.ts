export interface BookingDTO {
    user_id: number; // ID người dùng, lấy từ session hoặc token
    tour_id: number; // ID tour, lấy từ URL hoặc chọn
    tour_name: string; // Tên tour
    amount: number; // Số lượng khách
    start_date: Date; // Ngày bắt đầu tour
    total_price: number; // Tổng giá tiền
    status: string; // Mặc định là "đang chờ xử lý"
    payment_method?: string; // Phương thức thanh toán
    notes?: string; // Ghi chú
  }
  