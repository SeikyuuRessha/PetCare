# PetCare Backend API

## Mô tả

Backend API cho hệ thống quản lý Pet Care sử dụng NestJS, Prisma, và ZenStack để auto-generate API với access control.

## Công nghệ sử dụng

- **NestJS**: Framework Node.js
- **Prisma**: ORM cho database
- **ZenStack**: Auto-generate API với access control
- **SQL Server**: Database
- **Swagger**: API Documentation
- **JWT**: Authentication

## Cấu trúc Project

```
src/
├── app.module.ts              # Root module
├── main.ts                    # Entry point
├── auth/                      # Authentication module
├── users/                     # User management
├── pets/                      # Pet management
├── appointments/              # Appointment management
├── medical-records/           # Medical record management
├── services/                  # Service management
├── service-bookings/          # Service booking management
├── rooms/                     # Room management
├── boarding-reservations/     # Boarding reservation management
├── notifications/             # Notification management
├── medicines/                 # Medicine management
├── prescriptions/             # Prescription management
├── payments/                  # Payment management
└── zenstack/                  # ZenStack integration
```

## Cài đặt

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình database

- Tạo database SQL Server với tên `PetCare`
- Cập nhật connection string trong file `.env`

### 3. Generate Prisma và ZenStack

```bash
npm run zenstack:generate
```

### 4. Migrate database (nếu cần)

```bash
npx prisma db push
```

## Chạy ứng dụng

### Development mode

```bash
npm run start:dev
```

### Production mode

```bash
npm run build
npm run start:prod
```

## API Endpoints

### Auto-generated ZenStack API

- **Base URL**: `http://localhost:8080/api`
- **Methods**: GET, POST, PUT, DELETE
- **Models**: User, Pet, Appointment, MedicalRecord, Service, ServiceOption, ServiceBooking, Room, BoardingReservation, Notification, Medicine, MedicationPackage, Prescription, Payment

### ZenStack API Examples

#### 1. Lấy danh sách users

```http
GET /api/User
```

#### 2. Tạo user mới

```http
POST /api/User
Content-Type: application/json

{
  "userId": "user1",
  "username": "john_doe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "password": "hashed_password",
  "phone": "0123456789",
  "address": "123 Main St",
  "role": "USER"
}
```

#### 3. Lấy thông tin user theo ID

```http
GET /api/User/user1
```

#### 4. Cập nhật user

```http
PUT /api/User/user1
Content-Type: application/json

{
  "fullName": "John Smith",
  "phone": "0987654321"
}
```

#### 5. Tạo pet mới

```http
POST /api/Pet
Content-Type: application/json

{
  "petId": "pet1",
  "name": "Buddy",
  "gender": "Male",
  "species": "Dog",
  "breed": "Golden Retriever",
  "color": "Golden",
  "ownerId": "user1"
}
```

#### 6. Tạo appointment

```http
POST /api/Appointment
Content-Type: application/json

{
  "appointmentId": "apt1",
  "petId": "pet1",
  "appointmentDate": "2025-06-10T10:00:00Z",
  "symptoms": "Cough and fever"
}
```

#### 7. Lấy appointments với include relations

```http
GET /api/Appointment?include={"pet":true,"medicalRecord":true}
```

#### 8. Filtering và sorting

```http
GET /api/Pet?where={"species":"Dog"}&orderBy={"name":"asc"}
```

## Access Control

ZenStack tự động áp dụng access control rules được định nghĩa trong `schema.zmodel`:

### User Access

- Users chỉ có thể truy cập data của chính họ
- Admin/Employee/Doctor có quyền đọc thông tin users

### Pet Access

- Chủ pet có toàn quyền với pet của mình
- Staff có quyền đọc/cập nhật thông tin pets

### Appointment Access

- Chủ pet quản lý appointments của pet
- Staff có toàn quyền quản lý appointments

### Medical Record Access

- Bác sĩ tạo record có toàn quyền
- Chủ pet có quyền đọc medical records
- Admin có toàn quyền

## API Documentation

Swagger documentation có sẵn tại: `http://localhost:8080/api/docs`

## Environment Variables

```env
DATABASE_URL="sqlserver://localhost:1444;username=sa;password=your_password;database=PetCare;encrypt=true;trustServerCertificate=true"
JWT_ACCESS_SECRET="your_jwt_access_secret"
JWT_REFRESH_SECRET="your_jwt_refresh_secret"
JWT_ACCESS_EXPIRESIN="1d"
JWT_REFRESH_EXPIRESIN="7d"
PORT=8080
```

## Scripts

```bash
# Development
npm run start:dev           # Chạy dev server với watch mode
npm run zenstack:dev        # Generate ZenStack + chạy dev server

# Build & Production
npm run build              # Build project
npm run start:prod         # Chạy production server

# Code Quality
npm run lint               # Lint code
npm run format             # Format code với Prettier

# Testing
npm run test               # Chạy unit tests
npm run test:e2e           # Chạy e2e tests
npm run test:cov           # Chạy tests với coverage

# ZenStack
npm run zenstack:generate  # Generate Prisma schema và ZenStack APIs
```

## Database Schema

Project sử dụng các models chính:

- **User**: Quản lý người dùng (USER, EMPLOYEE, DOCTOR, ADMIN)
- **Pet**: Thông tin thú cưng
- **Appointment**: Lịch hẹn khám
- **MedicalRecord**: Hồ sơ bệnh án
- **Service/ServiceOption**: Dịch vụ và các tùy chọn
- **ServiceBooking**: Đặt dịch vụ
- **Room**: Phòng lưu trú
- **BoardingReservation**: Đặt phòng lưu trú
- **Notification**: Thông báo
- **Medicine/MedicationPackage**: Thuốc và gói thuốc
- **Prescription**: Đơn thuốc
- **Payment**: Thanh toán

## Troubleshooting

### Lỗi database connection

- Kiểm tra SQL Server đang chạy
- Verify connection string trong `.env`
- Đảm bảo database `PetCare` đã được tạo

### Lỗi ZenStack generate

- Chạy `npm run zenstack:generate` để re-generate
- Kiểm tra syntax trong `schema.zmodel`

### Lỗi build

- Xóa thư mục `dist` và `node_modules`, sau đó:

````bash
npm install
npm run zenstack:generate
npm run build
```## Contributing

1. Fork project
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Tạo Pull Request

## License

This project is licensed under the MIT License.
````
