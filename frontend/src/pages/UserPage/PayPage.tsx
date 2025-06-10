import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layouts/Header";
import TopBar from "../../components/layouts/TopBar";
import Footer from "../../components/layouts/Footer";
import { paymentService, Payment } from "../../services/paymentService";
import { toast } from "react-toastify";

interface CartItem {
    id: string;
    serviceName: string;
    packageName?: string;
    price: number;
    petName: string;
    total: number;
    serviceBookingId?: string;
    roomBookId?: string;
}

export default function PayPage() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            // Load user's payments to show transaction history
            const paymentsData = await paymentService.getMyPayments();
            setPayments(paymentsData || []); // Ensure it's always an array

            // Load cart items from localStorage or API
            const savedCart = localStorage.getItem("petcare_cart");
            if (savedCart) {
                setCartItems(JSON.parse(savedCart));
            }
        } catch (error: any) {
            console.error("Failed to load payment data:", error);
            setPayments([]); // Set empty array on error
            if (error?.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = (itemId: string) => {
        const updatedCart = cartItems.filter((item) => item.id !== itemId);
        setCartItems(updatedCart);
        localStorage.setItem("petcare_cart", JSON.stringify(updatedCart));
    };

    const getTotalAmount = () => {
        return cartItems.reduce((sum, item) => sum + item.total, 0);
    };

    const handlePayment = async (
        paymentMethod: "CASH" | "CARD" | "BANK_TRANSFER" | "E_WALLET" | "ALL",
        paymentId?: string
    ) => {
        try {
            setProcessing(true);

            if (paymentMethod === "ALL") {
                // Pay all pending payments
                const pendingPayments = payments.filter(
                    (p) => p.status === "PENDING"
                );
                for (const payment of pendingPayments) {
                    await paymentService.updatePayment(payment.paymentId, {
                        status: "COMPLETED",
                    });
                }
            } else if (paymentId) {
                // Pay single payment
                await paymentService.updatePayment(paymentId, {
                    status: "COMPLETED",
                });
            } else {
                // Process payment for cart items
                for (const item of cartItems) {
                    await paymentService.createPayment({
                        totalAmount: item.total,
                        serviceBookingId: item.serviceBookingId,
                        roomBookId: item.roomBookId,
                    });
                }

                // Clear cart after successful payment
                setCartItems([]);
                localStorage.removeItem("petcare_cart");
            }

            // Show success message
            toast.success("Thanh toán thành công!");

            // Reload payments to show updated status
            await loadData();
        } catch (error: any) {
            console.error("Payment failed:", error);
            toast.error(
                error.response?.data?.message ||
                    "Thanh toán thất bại. Vui lòng thử lại!"
            );
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="font-sans bg-white min-h-screen">
            <TopBar />
            <Header />

            {/* Main Content */}
            <main className="px-8 py-8 max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold mt-4">Thanh Toán</h1>
                    <button
                        onClick={() => navigate("/appointment")}
                        className="bg-[#7bb12b] text-white px-8 py-2.5 rounded-full font-semibold shadow hover:bg-[#6aa11e] transition"
                    >
                        Xem lịch khám
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="text-lg">Đang tải...</div>
                    </div>
                ) : (
                    <>
                        {/* Cart Items */}
                        {cartItems.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                                <h2 className="text-xl font-semibold mb-4">
                                    Giỏ hàng
                                </h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border-separate border-spacing-0 mb-6">
                                        <thead>
                                            <tr className="text-left text-gray-700 border-b">
                                                <th className="font-semibold pb-3 pl-2">
                                                    {" "}
                                                </th>
                                                <th className="font-semibold pb-3">
                                                    Dịch vụ
                                                </th>
                                                <th className="font-semibold pb-3">
                                                    Gói
                                                </th>
                                                <th className="font-semibold pb-3">
                                                    Giá
                                                </th>
                                                <th className="font-semibold pb-3">
                                                    Thú cưng
                                                </th>
                                                <th className="font-semibold pb-3">
                                                    Tổng
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartItems.map((item) => (
                                                <tr
                                                    key={item.id}
                                                    className="border-b"
                                                >
                                                    <td className="py-4 pl-2 align-middle">
                                                        <button
                                                            onClick={() =>
                                                                removeFromCart(
                                                                    item.id
                                                                )
                                                            }
                                                            className="text-gray-400 hover:text-red-500 text-lg font-bold"
                                                        >
                                                            ×
                                                        </button>
                                                    </td>
                                                    <td className="py-4 flex items-center gap-3 min-w-[200px]">
                                                        <div className="w-10 h-10 bg-gray-300 rounded" />
                                                        <span className="font-semibold">
                                                            {item.serviceName}
                                                        </span>
                                                    </td>
                                                    <td className="py-4">
                                                        {item.packageName ||
                                                            "---"}
                                                    </td>
                                                    <td className="py-4">
                                                        ${item.price.toFixed(2)}
                                                    </td>
                                                    <td className="py-4">
                                                        {item.petName}
                                                    </td>
                                                    <td className="py-4">
                                                        ${item.total.toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex justify-end items-center mb-8">
                                    <span className="text-lg font-semibold mr-2">
                                        Tổng :
                                    </span>
                                    <span className="text-[#1797a6] text-xl font-bold">
                                        ${getTotalAmount().toFixed(2)}
                                    </span>
                                </div>

                                {/* Payment Methods */}
                                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                                    <h3 className="text-lg font-semibold mb-4">
                                        Chọn phương thức thanh toán
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <button
                                            onClick={() =>
                                                handlePayment("CASH")
                                            }
                                            disabled={processing}
                                            className="bg-green-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        >
                                            {processing
                                                ? "Đang xử lý..."
                                                : "Tiền mặt"}
                                        </button>
                                        <button
                                            onClick={() =>
                                                handlePayment("CARD")
                                            }
                                            disabled={processing}
                                            className="bg-blue-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        >
                                            {processing
                                                ? "Đang xử lý..."
                                                : "Thẻ tín dụng"}
                                        </button>
                                        <button
                                            onClick={() =>
                                                handlePayment("BANK_TRANSFER")
                                            }
                                            disabled={processing}
                                            className="bg-purple-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-purple-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        >
                                            {processing
                                                ? "Đang xử lý..."
                                                : "Chuyển khoản"}
                                        </button>
                                        <button
                                            onClick={() =>
                                                handlePayment("E_WALLET")
                                            }
                                            disabled={processing}
                                            className="bg-orange-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        >
                                            {processing
                                                ? "Đang xử lý..."
                                                : "Ví điện tử"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pending Payments Section */}
                        {payments.some((p) => p.status === "PENDING") && (
                            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">
                                        Hóa đơn chờ thanh toán
                                    </h2>
                                    <button
                                        onClick={() => {
                                            const pendingAmount = payments
                                                .filter(
                                                    (p) =>
                                                        p.status === "PENDING"
                                                )
                                                .reduce(
                                                    (sum, p) =>
                                                        sum +
                                                        (Number(
                                                            p.totalAmount
                                                        ) || 0),
                                                    0
                                                );
                                            if (
                                                window.confirm(
                                                    `Xác nhận thanh toán tất cả hóa đơn chưa thanh toán?\nTổng tiền: ${pendingAmount.toFixed(
                                                        0
                                                    )} VNĐ`
                                                )
                                            ) {
                                                handlePayment("ALL");
                                            }
                                        }}
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? "Đang xử lý..."
                                            : "Thanh toán tất cả"}
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {payments
                                        .filter((p) => p.status === "PENDING")
                                        .map((payment) => (
                                            <div
                                                key={payment.paymentId}
                                                className="border-b pb-4 last:border-b-0"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="font-medium">
                                                            {payment.serviceBooking
                                                                ? `Đặt dịch vụ: ${payment.serviceBooking?.serviceOption?.service?.serviceName}`
                                                                : payment.boardingReservation
                                                                ? `Đặt phòng: ${payment.boardingReservation?.room?.roomNumber}`
                                                                : "Đặt khám"}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            Ngày tạo:{" "}
                                                            {payment.paymentDate
                                                                ? new Date(
                                                                      payment.paymentDate
                                                                  ).toLocaleDateString(
                                                                      "vi-VN"
                                                                  )
                                                                : "N/A"}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-semibold mb-2">
                                                            {Number(
                                                                payment.totalAmount ||
                                                                    0
                                                            ).toFixed(0)}{" "}
                                                            VNĐ
                                                        </div>
                                                        <button
                                                            onClick={() =>
                                                                handlePayment(
                                                                    "CASH",
                                                                    payment.paymentId
                                                                )
                                                            }
                                                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
                                                            disabled={
                                                                processing
                                                            }
                                                        >
                                                            {processing
                                                                ? "Đang xử lý..."
                                                                : "Thanh toán"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Payment History */}
                        {payments &&
                            payments.some((p) => p.status !== "PENDING") && (
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold">
                                            Lịch sử thanh toán
                                        </h2>
                                    </div>
                                    <div className="space-y-4">
                                        {payments
                                            .filter(
                                                (p) => p.status !== "PENDING"
                                            )
                                            .slice(0, 5)
                                            .map((payment) => (
                                                <div
                                                    key={payment.paymentId}
                                                    className="border-b pb-4 last:border-b-0"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <div className="font-medium">
                                                                {payment.serviceBooking
                                                                    ? `Dịch vụ: ${payment.serviceBooking.serviceOption.service.serviceName}`
                                                                    : payment.boardingReservation
                                                                    ? "Dịch vụ: Gửi thú cưng"
                                                                    : "Dịch vụ: Khám thú cưng"}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                Ngày:{" "}
                                                                {payment.paymentDate
                                                                    ? new Date(
                                                                          payment.paymentDate
                                                                      ).toLocaleDateString(
                                                                          "vi-VN"
                                                                      )
                                                                    : "N/A"}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-semibold">
                                                                {Number(
                                                                    payment.totalAmount ||
                                                                        0
                                                                ).toFixed(
                                                                    0
                                                                )}{" "}
                                                                VNĐ
                                                            </div>
                                                            <div className="flex flex-col items-end gap-2">
                                                                <div
                                                                    className={`text-sm px-2 py-1 rounded ${
                                                                        payment.status ===
                                                                        "COMPLETED"
                                                                            ? "bg-green-100 text-green-800"
                                                                            : payment.status ===
                                                                              "PENDING"
                                                                            ? "bg-yellow-100 text-yellow-800"
                                                                            : payment.status ===
                                                                              "FAILED"
                                                                            ? "bg-red-100 text-red-800"
                                                                            : "bg-gray-100 text-gray-800"
                                                                    }`}
                                                                >
                                                                    {payment.status ===
                                                                    "COMPLETED"
                                                                        ? "Hoàn thành"
                                                                        : payment.status ===
                                                                          "PENDING"
                                                                        ? "Đang xử lý"
                                                                        : payment.status ===
                                                                          "FAILED"
                                                                        ? "Thất bại"
                                                                        : "Đã hủy"}
                                                                </div>
                                                                {payment.status ===
                                                                    "PENDING" && (
                                                                    <button
                                                                        onClick={() =>
                                                                            handlePayment(
                                                                                "CASH",
                                                                                payment.paymentId
                                                                            )
                                                                        }
                                                                        className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors"
                                                                        disabled={
                                                                            processing
                                                                        }
                                                                    >
                                                                        {processing
                                                                            ? "Đang xử lý..."
                                                                            : "Thanh toán"}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        {payments.length > 5 && (
                                            <div className="text-center">
                                                <button className="text-[#1797a6] hover:underline">
                                                    Xem tất cả (
                                                    {payments.length} giao dịch)
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}
