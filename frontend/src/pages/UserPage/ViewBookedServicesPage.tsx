import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layouts/Header";
import TopBar from "../../components/layouts/TopBar";
import Footer from "../../components/layouts/Footer";
import BookedServiceCard from "../../components/shared/BookedServiceCard";
import {
    ServiceBooking,
    serviceBookingService,
} from "../../services/serviceBookingService";
import { BoardingReservation } from "../../services/boardingReservationService";
import { userBookingService } from "../../services/userBookingService";
import { toast } from "react-toastify";

export default function ViewBookedServicesPage() {
    const navigate = useNavigate();
    const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>(
        []
    );
    const [boardingReservations, setBoardingReservations] = useState<
        BoardingReservation[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadBookedServices();
    }, []);

    // Function to handle cancellation of service bookings
    const handleCancelServiceBooking = async (bookingId: string) => {
        if (cancelling) return; // Prevent multiple clicks

        try {
            setCancelling(true);
            await serviceBookingService.cancelServiceBooking(bookingId);
            toast.success("Dịch vụ đã được hủy thành công");

            // Reload bookings to update the UI
            await loadBookedServices();
        } catch (error: any) {
            console.error("Error cancelling service booking:", error);
            toast.error(
                error?.response?.data?.message ||
                    "Không thể hủy dịch vụ. Vui lòng thử lại sau."
            );
        } finally {
            setCancelling(false);
        }
    };

    const loadBookedServices = async () => {
        try {
            setLoading(true);
            setError(null);
            const {
                serviceBookings: serviceBookingsData,
                boardingReservations: boardingReservationsData,
            } = await userBookingService.getMyAllBookings();
            setServiceBookings(serviceBookingsData || []);
            setBoardingReservations(boardingReservationsData || []);
        } catch (error: any) {
            // Check if it's a 401 error (unauthorized)
            if (error?.response?.status === 401) {
                navigate("/login");
                return;
            }

            // Check if it's a network error (no response) or server error (5xx)
            const isNetworkError = !error?.response;
            const isServerError = error?.response?.status >= 500;

            if (isNetworkError || isServerError) {
                // Show error for genuine network/server issues
                setError("Có lỗi xảy ra khi tải dữ liệu");
            } else {
                // For other errors (like 400, 404), likely means no data exists
                // Don't show error, let it show "no services" message
                setError(null);
            }

            // Always set empty arrays so the UI can show appropriate message
            setServiceBookings([]);
            setBoardingReservations([]);
        } finally {
            setLoading(false);
        }
    }; // Convert service bookings to display format
    const convertServiceBookings = (bookings: ServiceBooking[]) => {
        return bookings.map((booking) => ({
            pet: {
                petId: booking.pet.petId,
                name: booking.pet.name,
                owner: booking.pet.owner.fullName,
                species: booking.pet.species,
                breed: booking.pet.breed,
                imageUrl: "/pet-avatar.png",
            },
            service: {
                id: booking.bookingId, // Add the booking ID for cancellation
                title: booking.serviceOption.service.serviceName,
                description: booking.serviceOption.optionName,
                price: `$${booking.serviceOption.price}`,
                features: booking.serviceOption.description
                    ? [booking.serviceOption.description]
                    : [],
                type: "Pet Care" as const,
                serviceDetails: {
                    date: new Date(booking.bookingDate).toLocaleDateString(
                        "vi-VN"
                    ),
                    time: new Date(booking.bookingDate).toLocaleTimeString(
                        "vi-VN",
                        {
                            hour: "2-digit",
                            minute: "2-digit",
                        }
                    ),
                    notes: booking.specialRequirements || "",
                    totalAmount: `$${booking.serviceOption.price}`,
                },
            },
            status: getStatusText(booking.status),
        }));
    }; // Convert boarding reservations to display format
    const convertBoardingReservations = (
        reservations: BoardingReservation[]
    ) => {
        return reservations.map((reservation) => ({
            pet: {
                petId: reservation.pet.petId,
                name: reservation.pet.name,
                owner: reservation.pet.owner.fullName,
                species: reservation.pet.species,
                breed: reservation.pet.breed,
                imageUrl: "/pet-avatar.png",
            },
            service: {
                id: reservation.reservationId, // Add reservation ID
                title: "Gửi thú cưng",
                description: `Phòng ${reservation.room.roomNumber}`,
                price: `$${reservation.room.price}/ngày`,
                features: [
                    "Chăm sóc chu đáo",
                    "Phòng riêng thoải mái",
                    reservation.room.description || "",
                ].filter(Boolean),
                type: "Pet Care" as const,
                serviceDetails: {
                    startDate: new Date(
                        reservation.checkInDate
                    ).toLocaleDateString("vi-VN"),
                    endDate: new Date(
                        reservation.checkOutDate
                    ).toLocaleDateString("vi-VN"),
                    room: `Phòng ${reservation.room.roomNumber}`,
                    notes: reservation.specialRequirements || "",
                    totalAmount: `$${reservation.totalAmount}`,
                },
            },
            status: getStatusText(reservation.status),
        }));
    };
    const getStatusText = (status: string) => {
        const statusMap: { [key: string]: string } = {
            PENDING: "Đang chờ xác nhận",
            CONFIRMED: "Đã xác nhận",
            COMPLETED: "Đã hoàn thành",
            CHECKED_IN: "Đã check-in",
            CHECKED_OUT: "Đã check-out",
            CANCELLED: "Đã hủy",
        };
        return statusMap[status] || status;
    };

    // Combine and sort all bookings
    const allBookedServices = [
        ...convertServiceBookings(serviceBookings),
        ...convertBoardingReservations(boardingReservations),
    ];
    return (
        <div className="font-sans bg-white min-h-screen">
            <TopBar />
            <Header />
            {/* Back arrow */}
            <div
                className="mt-8 ml-12 cursor-pointer"
                onClick={() => navigate("/services")}
            >
                <svg width="60" height="32" viewBox="0 0 60 32" fill="none">
                    <path
                        d="M40 16H8M8 16L20 28M8 16L20 4"
                        stroke="#7bb12b"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>{" "}
            <main className="px-12 py-8">
                <h1 className="text-3xl font-bold mb-8 text-center">
                    Dịch vụ đã đặt
                </h1>

                {/* Statistics info */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <h3 className="text-lg font-semibold text-blue-700">
                            Dịch vụ chăm sóc
                        </h3>
                        <p className="text-2xl font-bold text-blue-900">
                            {serviceBookings.length}
                        </p>
                        <p className="text-sm text-blue-600">booking(s)</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                        <h3 className="text-lg font-semibold text-green-700">
                            Dịch vụ gửi thú cưng
                        </h3>
                        <p className="text-2xl font-bold text-green-900">
                            {boardingReservations.length}
                        </p>
                        <p className="text-sm text-green-600">reservation(s)</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <h3 className="text-lg font-semibold text-purple-700">
                            Tổng cộng
                        </h3>
                        <p className="text-2xl font-bold text-purple-900">
                            {allBookedServices.length}
                        </p>
                        <p className="text-sm text-purple-600">
                            dịch vụ đã đặt
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="text-xl text-gray-600">
                            Đang tải dữ liệu...
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center py-12">
                        <div className="text-xl text-gray-600 mb-4">
                            Có lỗi xảy ra khi tải dữ liệu
                        </div>
                        <button
                            onClick={loadBookedServices}
                            className="bg-[#1797a6] text-white px-6 py-2 rounded-lg hover:bg-[#127c8a] transition"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : allBookedServices.length === 0 ? (
                    <div className="flex flex-col items-center py-12">
                        <div className="text-xl text-gray-600 mb-4">
                            Bạn hiện không đặt dịch vụ nào
                        </div>
                        <button
                            onClick={() => navigate("/services")}
                            className="bg-[#1797a6] text-white px-8 py-3 rounded-lg hover:bg-[#127c8a] transition"
                        >
                            Đặt dịch vụ ngay
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Service Bookings Section */}
                        {serviceBookings.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4 text-blue-700">
                                    Dịch vụ chăm sóc ({serviceBookings.length})
                                </h2>
                                <div className="space-y-6">
                                    {" "}
                                    {convertServiceBookings(
                                        serviceBookings
                                    ).map((service, index) => (
                                        <BookedServiceCard
                                            key={`service-${service.pet.petId}-${index}`}
                                            pet={service.pet}
                                            service={service.service}
                                            status={service.status}
                                            showCancelButton={
                                                !service.status.includes(
                                                    "Đã hủy"
                                                ) &&
                                                !service.status.includes(
                                                    "Đã hoàn thành"
                                                )
                                            }
                                            onCancel={
                                                handleCancelServiceBooking
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Boarding Reservations Section */}
                        {boardingReservations.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4 text-green-700">
                                    Dịch vụ gửi thú cưng (
                                    {boardingReservations.length})
                                </h2>
                                <div className="space-y-6">
                                    {" "}
                                    {convertBoardingReservations(
                                        boardingReservations
                                    ).map((service, index) => (
                                        <BookedServiceCard
                                            key={`boarding-${service.pet.petId}-${index}`}
                                            pet={service.pet}
                                            service={service.service}
                                            status={service.status}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
