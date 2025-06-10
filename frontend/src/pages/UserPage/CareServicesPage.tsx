import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/layouts/Header";
import TopBar from "../../components/layouts/TopBar";
import Footer from "../../components/layouts/Footer";
import { serviceService, Service } from "../../services/serviceService";

export default function CareServicesPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            setLoading(true);
            setError(null);
            const servicesData = await serviceService.getAllServices();
            setServices(servicesData || []);
        } catch (error: any) {
            console.error("Failed to load services:", error);
            setError("Không thể tải danh sách dịch vụ");
        } finally {
            setLoading(false);
        }
    };

    const getServiceIcon = (serviceName: string): string => {
        const name = serviceName.toLowerCase();
        if (name.includes("tắm") || name.includes("bath"))
            return "../public/images/bath.jpg";
        if (
            name.includes("cắt") ||
            name.includes("tỉa") ||
            name.includes("groom")
        )
            return "../public/images/groom.jpg";
        if (
            name.includes("gửi") ||
            name.includes("trông") ||
            name.includes("board")
        )
            return "../public/images/board.jpg";
        if (name.includes("huấn") || name.includes("train"))
            return "../public/images/train.jpg";
        return "../public/images/service-default.jpg"; // fallback icon
    };

    const handleServiceClick = (service: Service) => {
        // Navigate to service options page
        navigate(`/services/${service.serviceId}/options`);
    };

    return (
        <div className="font-sans">
            <TopBar />
            <Header />
            {/* Banner + Info */}
            <section className="flex flex-col md:flex-row items-start px-8 pt-10 pb-4 relative">
                <div className="w-full md:w-[350px] h-[300px] rounded-lg mb-6 md:mb-0 overflow-hidden">
                    <img
                        src="../public/images/banner.jpg"
                        alt="Pet Care Banner"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="md:ml-10 flex-1">
                    <h1 className="text-3xl font-bold mb-2">
                        Về{" "}
                        <span className="text-[#7bb12b]">Dịch vụ chăm sóc</span>
                    </h1>
                    <p className="text-gray-600 mb-2">
                        Chúng tôi là dịch vụ chăm sóc tốt nhất giành cho thú
                        cưng của bạn
                    </p>
                    <p className="text-gray-600">
                        Các dịch vụ chất lượng cao đem đến sự hài lòng cho người
                        bạn nhỏ
                    </p>
                </div>
                {/* Contact Card */}
                <div className="absolute left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-12 top-[260px] md:top-16 bg-white shadow-lg rounded-lg flex w-[420px]">
                    <div className="flex-1 flex flex-col items-center justify-center py-4 border-r">
                        <div className="bg-gray-200 rounded-full p-2 mb-1">
                            <img
                                src="../public/images/phone.jpg"
                                alt="Phone"
                                className="h-6"
                            />
                        </div>
                        <div className="text-xs text-gray-700">
                            (+990) 12346678
                            <br />
                            (+990) 26746178
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center py-4 border-r">
                        <div className="bg-gray-200 rounded-full p-2 mb-1">
                            <img
                                src="../public/images/location.jpg"
                                alt="Location"
                                className="h-6"
                            />
                        </div>
                        <div className="text-xs text-gray-700 text-center">
                            Melboard Road,
                            <br />
                            Hà Nội
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center py-4">
                        <div className="bg-gray-200 rounded-full p-2 mb-1">
                            <img
                                src="../public/images/th.jpg"
                                alt="Mail"
                                className="h-6"
                            />
                        </div>
                        <div className="text-xs text-gray-700 text-center">
                            pethealthy@gmail.com
                            <br />
                            support@gmail.com
                        </div>
                    </div>
                </div>
            </section>
            {/* View Booked Services Button */}
            <div className="flex justify-center mt-32 mb-16">
                <button
                    onClick={() => navigate("/services/booked")}
                    className="bg-[#1797a6] text-white px-12 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-[#127c8a] transition-all hover:scale-105"
                >
                    Xem các dịch vụ đã đặt
                </button>
            </div>{" "}
            {/* Services */}
            <section className="pb-12 bg-white">
                <h2 className="text-3xl font-bold text-center mb-10">
                    Dịch vụ của chúng tôi
                </h2>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7bb12b]"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-8">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button
                            onClick={loadServices}
                            className="bg-[#7bb12b] text-white px-6 py-2 rounded hover:bg-[#5d990f] transition-colors"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : services.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">
                            Hiện tại chưa có dịch vụ nào khả dụng
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center gap-8">
                        {services.map((service) => (
                            <div
                                key={service.serviceId}
                                className="bg-white rounded-lg shadow p-6 w-56 flex flex-col items-center"
                            >
                                <div className="w-24 h-24 rounded-full mb-4 overflow-hidden">
                                    <img
                                        src={getServiceIcon(
                                            service.serviceName
                                        )}
                                        alt={service.serviceName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="font-bold mb-2">
                                    {service.serviceName}
                                </h3>
                                <p className="text-xs text-gray-500 text-center mb-4">
                                    {service.description ||
                                        "Dịch vụ chăm sóc thú cưng chuyên nghiệp"}
                                </p>{" "}
                                <button
                                    onClick={() => handleServiceClick(service)}
                                    className="text-teal-600 font-semibold text-sm flex items-center gap-1 hover:text-teal-700 transition-colors"
                                >
                                    Đặt Ngay <span className="text-xs">✱</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
            {/* Team */}
            <section className="bg-[#f6f8f5] py-16">
                <h2 className="text-3xl font-bold text-center mb-10">
                    Đội ngũ chăm sóc
                </h2>
                <div className="flex flex-wrap justify-center gap-8">
                    {[1, 2, 3, 4].map((index) => (
                        <div
                            key={index}
                            className="w-56 h-72 rounded-lg overflow-hidden relative"
                        >
                            <img
                                src={`../public/images/staff${index}.jpg`}
                                alt={`Team Member ${index}`}
                                className="w-full h-full object-cover"
                            />
                            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded text-xs">
                                Condet Klo
                            </span>
                        </div>
                    ))}
                </div>
            </section>
            {/* Pet Happy Section */}
            <section className="flex flex-col md:flex-row items-center px-8 py-16 bg-white">
                <div className="relative w-full md:w-[400px] h-[300px]">
                    <div className="absolute left-0 top-8 w-[320px] h-[220px] bg-[#1797a6] rounded-lg" />
                    <div className="absolute left-10 top-0 w-[320px] h-[220px] overflow-hidden rounded-lg">
                        <img
                            src="../public/images/image2.png"
                            alt="Happy Pet"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                <div className="md:ml-12 mt-8 md:mt-0 flex-1">
                    <h2 className="text-2xl font-bold mb-4">
                        Thú cưng của bạn sẽ hạnh phúc
                    </h2>
                    <p className="mb-4 text-gray-700">
                        Dịch vụ tiên tiến đem lại cho thú cưng của bạn trải
                        nghiệm tốt nhất khi sử dụng dịch vụ của chúng tôi.
                    </p>
                    <ul className="list-none space-y-2 text-gray-600 text-sm">
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-600 rounded-full inline-block" />
                            Hỗ trợ thanh toán online.
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-600 rounded-full inline-block" />
                            Tư vấn lựa chọn dịch vụ phù hợp
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-600 rounded-full inline-block" />
                            Theo các gói combo đơn giản, giá rẻ
                        </li>
                    </ul>
                    <button className="mt-6 text-black font-semibold flex items-center gap-1">
                        Book Now <span className="text-xs">✱</span>
                    </button>
                </div>
            </section>{" "}
            <Footer />
        </div>
    );
}
