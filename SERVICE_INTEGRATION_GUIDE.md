# PetCare Service Integration - Hướng dẫn test

## Đã hoàn thành:

✅ **Tích hợp API Services và Service Options:**

-   Trang `/services` hiển thị danh sách services thật từ backend
-   Khi click "Đặt ngay" → chuyển đến `/services/{serviceId}/options`
-   Trang service options hiển thị các gói dịch vụ thật từ API
-   Tích hợp đặt dịch vụ thật qua API `service-bookings`

✅ **Các thay đổi chính:**

-   `CareServicesPage.tsx`: Tích hợp API để load danh sách services
-   `ServiceOptionsPage.tsx`: Trang mới hiển thị service options và đặt dịch vụ
-   `App.tsx`: Thêm route `/services/:serviceId/options`
-   Thay thế ServiceOptionsModal bằng ServiceOptionsPage

## Cách test:

### 1. Chuẩn bị data:

```sql
-- Chạy file SQL này trong database:
-- d:\Code\PetCare\backend\prisma\seed-services.sql

-- Hoặc copy-paste từng đoạn INSERT vào database management tool
```

### 2. Chạy backend:

```bash
cd d:\Code\PetCare\backend
npm run start:dev
```

### 3. Test API (optional):

```bash
cd d:\Code\PetCare
node test-api.js
```

### 4. Chạy frontend:

```bash
cd d:\Code\PetCare\frontend
npm start
```

### 5. Test workflow:

1. Mở http://localhost:3001/services
2. Click "Đặt ngay" trên bất kỳ service nào
3. Xem service options hiển thị từ API thật
4. Click "Đặt dịch vụ" → chọn pet → confirm
5. Kiểm tra trang `/services/booked` để xem dịch vụ đã đặt

## Cấu trúc data mẫu:

### Services:

-   `service-1`: Cắt tỉa lông thú cưng (3 options)
-   `service-2`: Huấn luyện thú cưng (3 options)
-   `service-3`: Tắm và chăm sóc thú cưng (3 options)

### Service Options (mỗi service có 3 gói):

-   Gói Cơ Bản/Huấn luyện Cơ Bản/Tắm Cơ Bản
-   Gói Tiêu Chuẩn/Huấn luyện Nâng Cao/Tắm Chăm Sóc
-   Gói Cao Cấp/Huấn luyện Chuyên Nghiệp/Tắm Spa Cao Cấp

## API Endpoints sử dụng:

### Services:

-   `GET /services` - Lấy danh sách services
-   `GET /services/{id}` - Lấy service theo ID

### Service Options:

-   `GET /service-options/service/{serviceId}` - Lấy options theo service

### Service Bookings:

-   `POST /service-bookings` - Tạo đặt dịch vụ mới
-   `GET /service-bookings/pet/{petId}` - Lấy bookings theo pet

## Lưu ý:

-   Cần đăng nhập để đặt dịch vụ
-   Cần có ít nhất 1 pet để test đặt dịch vụ
-   Fallback UI sẽ hiển thị nếu không có data từ API

## Các files đã thay đổi:

-   `frontend/src/pages/UserPage/CareServicesPage.tsx`
-   `frontend/src/pages/servicesPage/ServiceOptionsPage.tsx` (mới)
-   `frontend/src/components/shared/ServiceOptionsModal.tsx` (có thể xóa)
-   `frontend/src/App.tsx`
-   `backend/prisma/seed-services.sql` (mới)
