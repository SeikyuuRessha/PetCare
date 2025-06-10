import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/layouts/Header";
import TopBar from "../../components/layouts/TopBar";
import Footer from "../../components/layouts/Footer";
import PackageCard from "../../components/shared/PackageCard";
import ChoosePetComponent from "../../components/shared/ChoosePetComponent";
import ServiceBookingForm from "../../components/shared/ServiceBookingForm";
import {
    serviceService,
    serviceOptionService,
    Service,
    ServiceOption,
} from "../../services/serviceService";
import { serviceBookingService } from "../../services/serviceBookingService";

export default function ServiceOptionsPage() {
    const { serviceId } = useParams<{ serviceId: string }>();
    const navigate = useNavigate();
    const [service, setService] = useState<Service | null>(null);
    const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPetSelector, setShowPetSelector] = useState(false);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [selectedPet, setSelectedPet] = useState<any>(null);
    const [selectedServiceOption, setSelectedServiceOption] =
        useState<ServiceOption | null>(null);
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        if (serviceId) {
            loadServiceData();
        }
    }, [serviceId]);

    const loadServiceData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Load service details
            const serviceData = await serviceService.getServiceById(serviceId!);
            setService(serviceData);

            // Load service options
            const options =
                await serviceOptionService.getServiceOptionsByService(
                    serviceId!
                );
            setServiceOptions(options || []);
        } catch (error: any) {
            console.error("Failed to load service data:", error);
            setError("Không thể tải thông tin dịch vụ");
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async (serviceOption: ServiceOption) => {
        setSelectedServiceOption(serviceOption);
        setShowPetSelector(true);
    };
    const handlePetSelected = (pet: any) => {
        if (!selectedServiceOption) return;

        setSelectedPet(pet);
        setShowPetSelector(false);
        setShowBookingForm(true);
    };

    const handleBookingConfirm = async (bookingData: any) => {
        try {
            setBookingLoading(true);

            await serviceBookingService.createServiceBooking(bookingData);

            // Show success message and redirect
            alert(
                `Đặt dịch vụ thành công! Bạn đã đặt gói ${
                    selectedServiceOption?.optionName
                } cho ${selectedPet?.petName || selectedPet?.name}`
            );
            navigate("/services/booked");
        } catch (error: any) {
            console.error("Failed to create service booking:", error);
            alert("Có lỗi xảy ra khi đặt dịch vụ. Vui lòng thử lại!");
        } finally {
            setBookingLoading(false);
        }
    };

    const handleBookingCancel = () => {
        setShowBookingForm(false);
        setSelectedPet(null);
        setSelectedServiceOption(null);
    };

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const getServiceImage = (serviceName: string): string => {
        const name = serviceName.toLowerCase();
        if (
            name.includes("cắt") ||
            name.includes("tỉa") ||
            name.includes("groom")
        ) {
            return "../public/images/groom.jpg";
        } else if (name.includes("huấn") || name.includes("train")) {
            return "../public/images/train.jpg";
        } else if (name.includes("tắm") || name.includes("bath")) {
            return "../public/images/bath.jpg";
        } else if (name.includes("giữ") || name.includes("board")) {
            return "../public/images/board.jpg";
        }
        return "../public/images/groom.jpg";
    };

    const getServiceFeatures = (serviceName: string): string[] => {
        const name = serviceName.toLowerCase();
        if (
            name.includes("cắt") ||
            name.includes("tỉa") ||
            name.includes("groom")
        ) {
            return [
                "Tư vấn kiểu lông phù hợp thú cưng",
                "Cắt tỉa theo yêu cầu",
                "Dịch vụ chuyên nghiệp",
            ];
        } else if (name.includes("huấn") || name.includes("train")) {
            return [
                "Huấn luyện đi vệ sinh đúng chỗ",
                "Huấn luyện nhận dạng các cử chỉ của chủ nhân",
                "Diễn trò cùng chủ nhân",
            ];
        } else if (name.includes("tắm") || name.includes("bath")) {
            return [
                "Tắm sạch sẽ cho thú cưng",
                "Sử dụng sản phẩm an toàn",
                "Chăm sóc lông và da",
            ];
        } else if (name.includes("giữ") || name.includes("board")) {
            return [
                "Chăm sóc thú cưng 24/7",
                "Môi trường an toàn",
                "Theo dõi sức khỏe",
            ];
        }
        return ["Dịch vụ chất lượng cao", "Đội ngũ chuyên nghiệp"];
    };

    // Fallback packages if no API data
    const getFallbackPackages = () => {
        if (!service) return [];

        const name = service.serviceName.toLowerCase();
        if (
            name.includes("cắt") ||
            name.includes("tỉa") ||
            name.includes("groom")
        ) {
            return [
                {
                    title: "Gói Đồng",
                    description: "Gói rẻ nhất phúc lợi vẫn đầy đủ",
                    price: "350.000đ",
                    features: [
                        "Tư vấn kiểu lông phù hợp thú cưng.",
                        "Cắt tỉa theo yêu cầu.",
                    ],
                },
                {
                    title: "Gói Bạc",
                    description: "Kèm thêm dịch vụ tắm cho thú cưng",
                    price: "550.000đ",
                    features: [
                        "Tư vấn kiểu lông phù hợp thú cưng.",
                        "Cắt tỉa theo yêu cầu.",
                        "Tắm cho thú cưng của bạn.",
                    ],
                },
                {
                    title: "Gói Vàng",
                    description: "Dịch vụ Spa mắt xa",
                    price: "1.200.000đ",
                    features: [
                        "Tư vấn kiểu lông phù hợp thú cưng.",
                        "Cắt tỉa theo yêu cầu.",
                        "Tắm cho thú cưng của bạn.",
                        "Dịch vụ Spa khi tắm cho thú cưng",
                    ],
                },
            ];
        }
        // Add other service type fallbacks here...
        return [];
    };

    // Convert service options to package format
    const packages =
        serviceOptions.length > 0
            ? serviceOptions.map((option) => ({
                  title: option.optionName,
                  description: option.description || "Dịch vụ chuyên nghiệp",
                  price: option.price ? formatPrice(option.price) : "Liên hệ",
                  features: option.description
                      ? [option.description]
                      : getServiceFeatures(service?.serviceName || ""),
                  serviceOptionId: option.optionId,
                  onBooking: () => handleBooking(option),
              }))
            : getFallbackPackages().map((pkg) => ({
                  ...pkg,
                  onBooking: () => alert("Dịch vụ này hiện chưa khả dụng"),
              }));

    if (loading) {
        return (
            <div className="font-sans bg-white min-h-screen">
                <TopBar />
                <Header />
                <div className="flex justify-center items-center py-32">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#7bb12b]"></div>
                </div>
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="font-sans bg-white min-h-screen">
                <TopBar />
                <Header />
                <div className="text-center py-32">
                    <p className="text-red-500 mb-4 text-xl">
                        {error || "Không tìm thấy dịch vụ"}
                    </p>
                    <button
                        onClick={() => navigate("/services")}
                        className="bg-[#7bb12b] text-white px-6 py-3 rounded hover:bg-[#5d990f] transition-colors"
                    >
                        Quay lại danh sách dịch vụ
                    </button>
                </div>
            </div>
        );
    }

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
            </div>
            {/* Service Section */}
            <section className="flex flex-col md:flex-row items-start px-12 mt-2 mb-8">
                <div className="flex-1 pt-4">
                    <h1 className="text-4xl font-bold mb-2">
                        {service.serviceName}
                    </h1>
                    <p className="mb-4 text-gray-700 text-lg max-w-xl">
                        {service.description ||
                            `Dịch vụ ${service.serviceName.toLowerCase()} chuyên nghiệp cho thú cưng của bạn.`}
                    </p>
                    <ul className="mb-4 space-y-2 text-base">
                        {getServiceFeatures(service.serviceName).map(
                            (feature, index) => (
                                <li
                                    key={index}
                                    className="flex items-center text-[#7bb12b]"
                                >
                                    <span className="mr-2">✔</span>
                                    <span className="text-black">
                                        {feature}
                                    </span>
                                </li>
                            )
                        )}
                    </ul>
                    <a
                        href="#"
                        className="text-[#1797a6] font-semibold text-lg flex items-center gap-1"
                    >
                        Đọc thêm <span className="text-xl">✱</span>
                    </a>
                </div>
                <div className="flex-1 flex justify-end items-center gap-4">
                    <div className="relative w-[320px] h-[220px]">
                        <img
                            src={getServiceImage(service.serviceName)}
                            alt={service.serviceName}
                            className="absolute left-16 top-0 w-[180px] h-[140px] object-cover rounded-lg"
                        />
                        <img
                            src={getServiceImage(service.serviceName)}
                            alt={service.serviceName}
                            className="absolute left-8 top-8 w-[180px] h-[140px] object-cover rounded-lg"
                        />
                        <img
                            src={getServiceImage(service.serviceName)}
                            alt={service.serviceName}
                            className="absolute left-0 top-16 w-[180px] h-[140px] object-cover rounded-lg"
                        />
                    </div>
                </div>
            </section>
            {/* Packages Section */}
            <section className="px-12 py-8">
                <h2 className="text-4xl font-bold text-center mb-8 text-[#7bb12b]">
                    Gói Ưu Đãi
                </h2>

                {serviceOptions.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">
                            Hiện tại chưa có gói dịch vụ nào khả dụng
                        </p>
                        <button
                            onClick={loadServiceData}
                            className="bg-[#7bb12b] text-white px-6 py-2 rounded hover:bg-[#5d990f] transition-colors"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row justify-center gap-8">
                        {packages.map((pkg: any, index: number) => (
                            <PackageCard
                                key={pkg.serviceOptionId || index}
                                {...pkg}
                                type={
                                    pkg.title.includes("Vàng") ||
                                    pkg.title.includes("VIP")
                                        ? "Pet Care & Veterinary"
                                        : "Pet Care"
                                }
                            />
                        ))}
                    </div>
                )}
            </section>
            {/* Instagram Section */}
            <section className="px-12 py-12">
                <h2 className="text-3xl font-bold mb-8 text-[#7bb12b]">
                    <span className="text-black">#</span>Instagram
                </h2>
                <div className="flex gap-8 justify-center">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="relative w-40 h-40 rounded-lg overflow-hidden border-b-4 border-[#1797a6]"
                        >
                            <img
                                src={`../public/images/staff${i}.jpg`}
                                alt={`Instagram post ${i}`}
                                className="w-full h-full object-cover"
                            />
                            <span className="absolute left-2 top-2 text-xs text-white">
                                Thú cưng cùng chủ nhân đáng yêu!
                            </span>
                        </div>
                    ))}
                </div>
            </section>{" "}
            {/* Pet Selection Modal */}
            {showPetSelector && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setShowPetSelector(false)}
                >
                    <div
                        className="max-w-xl w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ChoosePetComponent
                            pet={selectedPet}
                            onSelectPet={handlePetSelected}
                        />
                    </div>
                </div>
            )}
            {/* Service Booking Form Modal */}
            {showBookingForm && selectedServiceOption && selectedPet && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setShowBookingForm(false)}
                >
                    <div
                        className="max-w-lg w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ServiceBookingForm
                            serviceOption={selectedServiceOption}
                            selectedPet={selectedPet}
                            onConfirm={handleBookingConfirm}
                            onCancel={handleBookingCancel}
                            loading={bookingLoading}
                        />
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}
