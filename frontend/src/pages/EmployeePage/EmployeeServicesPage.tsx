import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    serviceService,
    serviceOptionService,
    Service,
    ServiceOption,
    CreateServiceData,
    UpdateServiceData,
    CreateServiceOptionData,
    UpdateServiceOptionData,
} from "../../services/serviceService";
import { toast } from "react-toastify";

interface ServiceWithOptions extends Service {
    serviceOptions: ServiceOption[];
}

export default function EmployeeServicesPage() {
    const navigate = useNavigate();
    const [services, setServices] = useState<ServiceWithOptions[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedServiceId, setSelectedServiceId] = useState<string>("");
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [showOptionModal, setShowOptionModal] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [editingOption, setEditingOption] = useState<ServiceOption | null>(
        null
    );

    // Form states
    const [serviceForm, setServiceForm] = useState<CreateServiceData>({
        serviceName: "",
        description: "",
    });
    const [optionForm, setOptionForm] = useState<CreateServiceOptionData>({
        serviceId: "",
        optionName: "",
        price: 0,
        description: "",
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);

            // Load services
            const servicesData = await serviceService.getAllServices();

            // Load service options for each service
            const servicesWithOptions: ServiceWithOptions[] = [];

            for (const service of servicesData) {
                try {
                    const options =
                        await serviceOptionService.getServiceOptionsByService(
                            service.serviceId
                        );
                    servicesWithOptions.push({
                        ...service,
                        serviceOptions: options || [],
                    });
                } catch (error) {
                    console.error(
                        `Failed to load options for service ${service.serviceId}:`,
                        error
                    );
                    servicesWithOptions.push({
                        ...service,
                        serviceOptions: [],
                    });
                }
            }

            setServices(servicesWithOptions);
        } catch (error: any) {
            console.error("Failed to load data:", error);
            if (error?.response?.status === 401) {
                navigate("/login");
            }
            toast.error("Không thể tải dữ liệu dịch vụ");
        } finally {
            setLoading(false);
        }
    };

    // Service CRUD
    const handleCreateService = async () => {
        try {
            await serviceService.createService(serviceForm);
            toast.success("Tạo dịch vụ thành công!");
            setShowServiceModal(false);
            setServiceForm({ serviceName: "", description: "" });
            await loadData();
        } catch (error: any) {
            console.error("Failed to create service:", error);
            toast.error(
                "Không thể tạo dịch vụ: " +
                    (error?.response?.data?.message || error.message)
            );
        }
    };

    const handleUpdateService = async () => {
        if (!editingService) return;

        try {
            await serviceService.updateService(
                editingService.serviceId,
                serviceForm
            );
            toast.success("Cập nhật dịch vụ thành công!");
            setShowServiceModal(false);
            setEditingService(null);
            setServiceForm({ serviceName: "", description: "" });
            await loadData();
        } catch (error: any) {
            console.error("Failed to update service:", error);
            toast.error(
                "Không thể cập nhật dịch vụ: " +
                    (error?.response?.data?.message || error.message)
            );
        }
    };

    const handleDeleteService = async (serviceId: string) => {
        if (
            window.confirm(
                "Bạn có chắc chắn muốn xóa dịch vụ này? Tất cả tùy chọn dịch vụ sẽ bị xóa theo."
            )
        ) {
            try {
                await serviceService.deleteService(serviceId);
                toast.success("Xóa dịch vụ thành công!");
                await loadData();
            } catch (error: any) {
                console.error("Failed to delete service:", error);
                toast.error(
                    "Không thể xóa dịch vụ: " +
                        (error?.response?.data?.message || error.message)
                );
            }
        }
    };

    // Service Option CRUD
    const handleCreateOption = async () => {
        try {
            await serviceOptionService.createServiceOption(optionForm);
            toast.success("Tạo tùy chọn dịch vụ thành công!");
            setShowOptionModal(false);
            setOptionForm({
                serviceId: "",
                optionName: "",
                price: 0,
                description: "",
            });
            await loadData();
        } catch (error: any) {
            console.error("Failed to create service option:", error);
            toast.error(
                "Không thể tạo tùy chọn dịch vụ: " +
                    (error?.response?.data?.message || error.message)
            );
        }
    };

    const handleUpdateOption = async () => {
        if (!editingOption) return;

        try {
            const updateData: UpdateServiceOptionData = {
                optionName: optionForm.optionName,
                price: optionForm.price,
                description: optionForm.description,
            };
            await serviceOptionService.updateServiceOption(
                editingOption.optionId,
                updateData
            );
            toast.success("Cập nhật tùy chọn dịch vụ thành công!");
            setShowOptionModal(false);
            setEditingOption(null);
            setOptionForm({
                serviceId: "",
                optionName: "",
                price: 0,
                description: "",
            });
            await loadData();
        } catch (error: any) {
            console.error("Failed to update service option:", error);
            toast.error(
                "Không thể cập nhật tùy chọn dịch vụ: " +
                    (error?.response?.data?.message || error.message)
            );
        }
    };

    const handleDeleteOption = async (optionId: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tùy chọn dịch vụ này?")) {
            try {
                await serviceOptionService.deleteServiceOption(optionId);
                toast.success("Xóa tùy chọn dịch vụ thành công!");
                await loadData();
            } catch (error: any) {
                console.error("Failed to delete service option:", error);
                toast.error(
                    "Không thể xóa tùy chọn dịch vụ: " +
                        (error?.response?.data?.message || error.message)
                );
            }
        }
    };

    // Modal handlers
    const openCreateServiceModal = () => {
        setEditingService(null);
        setServiceForm({ serviceName: "", description: "" });
        setShowServiceModal(true);
    };

    const openEditServiceModal = (service: Service) => {
        setEditingService(service);
        setServiceForm({
            serviceName: service.serviceName,
            description: service.description || "",
        });
        setShowServiceModal(true);
    };

    const openCreateOptionModal = (serviceId: string) => {
        setEditingOption(null);
        setOptionForm({
            serviceId: serviceId,
            optionName: "",
            price: 0,
            description: "",
        });
        setShowOptionModal(true);
    };

    const openEditOptionModal = (option: ServiceOption) => {
        setEditingOption(option);
        setOptionForm({
            serviceId: option.serviceId,
            optionName: option.optionName,
            price: option.price || 0,
            description: option.description || "",
        });
        setShowOptionModal(true);
    };

    const selectedService = services.find(
        (s) => s.serviceId === selectedServiceId
    );

    if (loading) {
        return (
            <div className="font-sans bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#7bb12b]"></div>
                    <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="font-sans bg-white min-h-screen">
            {/* Top bar */}
            <div className="bg-[#7bb12b] text-white text-xs flex justify-between items-center px-8 py-1">
                <span>Employee Dashboard</span>
            </div>

            {/* Back button */}
            <div className="mt-8 ml-8">
                <button
                    onClick={() => navigate("/employee")}
                    className="flex items-center text-[#7bb12b] hover:text-[#5d990f]"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                    >
                        <path
                            d="M19 12H5M5 12L12 19M5 12L12 5"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span className="ml-2">Quay lại</span>
                </button>
            </div>

            <main className="px-8 py-6">
                <h1 className="text-3xl font-semibold mb-8">Quản Lý Dịch Vụ</h1>

                {/* Services Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">Dịch Vụ</h2>
                        <button
                            onClick={openCreateServiceModal}
                            className="bg-[#7bb12b] hover:bg-[#5d990f] text-white px-4 py-2 rounded-lg transition"
                        >
                            Thêm Dịch Vụ
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        Tên Dịch Vụ
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        Mô Tả
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        Số Tùy Chọn
                                    </th>
                                    <th className="px-6 py-3 text-center">
                                        Thao Tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {services.map((service) => (
                                    <tr
                                        key={service.serviceId}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 font-medium">
                                            {service.serviceName}
                                        </td>
                                        <td className="px-6 py-4">
                                            {service.description ||
                                                "Không có mô tả"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {service.serviceOptions?.length ||
                                                0}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() =>
                                                    openEditServiceModal(
                                                        service
                                                    )
                                                }
                                                className="text-blue-600 hover:text-blue-800 mr-4"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteService(
                                                        service.serviceId
                                                    )
                                                }
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Service Options Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">
                            Tùy Chọn Dịch Vụ
                        </h2>
                        <div className="flex gap-4">
                            <select
                                value={selectedServiceId}
                                onChange={(e) =>
                                    setSelectedServiceId(e.target.value)
                                }
                                className="border rounded px-3 py-2"
                            >
                                <option value="">Chọn dịch vụ</option>
                                {services.map((service) => (
                                    <option
                                        key={service.serviceId}
                                        value={service.serviceId}
                                    >
                                        {service.serviceName}
                                    </option>
                                ))}
                            </select>
                            {selectedServiceId && (
                                <button
                                    onClick={() =>
                                        openCreateOptionModal(selectedServiceId)
                                    }
                                    className="bg-[#7bb12b] hover:bg-[#5d990f] text-white px-4 py-2 rounded-lg transition"
                                >
                                    Thêm Tùy Chọn
                                </button>
                            )}
                        </div>
                    </div>

                    {selectedService ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left">
                                            Tên Tùy Chọn
                                        </th>
                                        <th className="px-6 py-3 text-left">
                                            Giá
                                        </th>
                                        <th className="px-6 py-3 text-left">
                                            Mô Tả
                                        </th>
                                        <th className="px-6 py-3 text-center">
                                            Thao Tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {selectedService.serviceOptions?.map(
                                        (option) => (
                                            <tr
                                                key={option.optionId}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 font-medium">
                                                    {option.optionName}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {option.price
                                                        ? `${option.price.toLocaleString()} VND`
                                                        : "Chưa có giá"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {option.description ||
                                                        "Không có mô tả"}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() =>
                                                            openEditOptionModal(
                                                                option
                                                            )
                                                        }
                                                        className="text-blue-600 hover:text-blue-800 mr-4"
                                                    >
                                                        Sửa
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteOption(
                                                                option.optionId
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        Xóa
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>

                            {(!selectedService.serviceOptions ||
                                selectedService.serviceOptions.length ===
                                    0) && (
                                <div className="text-center py-8 text-gray-500">
                                    Chưa có tùy chọn nào cho dịch vụ này.
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            Vui lòng chọn một dịch vụ để xem các tùy chọn.
                        </div>
                    )}
                </div>
            </main>

            {/* Service Modal */}
            {showServiceModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">
                            {editingService
                                ? "Chỉnh Sửa Dịch Vụ"
                                : "Thêm Dịch Vụ Mới"}
                        </h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                Tên Dịch Vụ *
                            </label>
                            <input
                                type="text"
                                value={serviceForm.serviceName}
                                onChange={(e) =>
                                    setServiceForm({
                                        ...serviceForm,
                                        serviceName: e.target.value,
                                    })
                                }
                                className="w-full border rounded px-3 py-2"
                                placeholder="Nhập tên dịch vụ"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">
                                Mô Tả
                            </label>
                            <textarea
                                value={serviceForm.description}
                                onChange={(e) =>
                                    setServiceForm({
                                        ...serviceForm,
                                        description: e.target.value,
                                    })
                                }
                                className="w-full border rounded px-3 py-2"
                                placeholder="Nhập mô tả dịch vụ"
                                rows={3}
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => {
                                    setShowServiceModal(false);
                                    setEditingService(null);
                                    setServiceForm({
                                        serviceName: "",
                                        description: "",
                                    });
                                }}
                                className="px-4 py-2 border rounded hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={
                                    editingService
                                        ? handleUpdateService
                                        : handleCreateService
                                }
                                className="px-4 py-2 bg-[#7bb12b] text-white rounded hover:bg-[#5d990f]"
                                disabled={!serviceForm.serviceName.trim()}
                            >
                                {editingService ? "Cập Nhật" : "Tạo Mới"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Service Option Modal */}
            {showOptionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">
                            {editingOption
                                ? "Chỉnh Sửa Tùy Chọn"
                                : "Thêm Tùy Chọn Mới"}
                        </h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                Tên Tùy Chọn *
                            </label>
                            <input
                                type="text"
                                value={optionForm.optionName}
                                onChange={(e) =>
                                    setOptionForm({
                                        ...optionForm,
                                        optionName: e.target.value,
                                    })
                                }
                                className="w-full border rounded px-3 py-2"
                                placeholder="Nhập tên tùy chọn"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                Giá (VND) *
                            </label>
                            <input
                                type="number"
                                value={optionForm.price}
                                onChange={(e) =>
                                    setOptionForm({
                                        ...optionForm,
                                        price: Number(e.target.value),
                                    })
                                }
                                className="w-full border rounded px-3 py-2"
                                placeholder="Nhập giá"
                                min="0"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">
                                Mô Tả
                            </label>
                            <textarea
                                value={optionForm.description}
                                onChange={(e) =>
                                    setOptionForm({
                                        ...optionForm,
                                        description: e.target.value,
                                    })
                                }
                                className="w-full border rounded px-3 py-2"
                                placeholder="Nhập mô tả tùy chọn"
                                rows={3}
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => {
                                    setShowOptionModal(false);
                                    setEditingOption(null);
                                    setOptionForm({
                                        serviceId: "",
                                        optionName: "",
                                        price: 0,
                                        description: "",
                                    });
                                }}
                                className="px-4 py-2 border rounded hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={
                                    editingOption
                                        ? handleUpdateOption
                                        : handleCreateOption
                                }
                                className="px-4 py-2 bg-[#7bb12b] text-white rounded hover:bg-[#5d990f]"
                                disabled={
                                    !optionForm.optionName.trim() ||
                                    !optionForm.price
                                }
                            >
                                {editingOption ? "Cập Nhật" : "Tạo Mới"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
