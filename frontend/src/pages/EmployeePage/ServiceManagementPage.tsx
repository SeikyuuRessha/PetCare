import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { serviceService, Service } from "../../services/serviceService";
import {
    serviceOptionService,
    ServiceOption,
} from "../../services/serviceOptionService";

export default function ServiceManagementPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [showOptionModal, setShowOptionModal] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [editingOption, setEditingOption] = useState<ServiceOption | null>(
        null
    );
    const [services, setServices] = useState<Service[]>([]);
    const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");

    // Form states
    const [serviceForm, setServiceForm] = useState({
        serviceName: "",
        description: "",
    });

    const [optionForm, setOptionForm] = useState({
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
            const [servicesData, optionsData] = await Promise.all([
                serviceService.getAllServices(),
                serviceOptionService.getAll(),
            ]);
            setServices(servicesData);
            setServiceOptions(optionsData);
        } catch (error: any) {
            setError(error.message || "Failed to load data");
            if (error?.response?.status === 401) {
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    // API handlers for services
    const handleCreateService = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await serviceService.createService(serviceForm);
            setSuccess("Thêm dịch vụ thành công!");
            setServiceForm({ serviceName: "", description: "" });
            setShowServiceModal(false);
            loadData();
            setTimeout(() => setSuccess(""), 3000);
        } catch (error: any) {
            setError(error.message || "Failed to create service");
            setTimeout(() => setError(""), 3000);
        }
    };

    const handleUpdateService = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingService) return;

        try {
            await serviceService.updateService(
                editingService.serviceId,
                serviceForm
            );
            setSuccess("Cập nhật dịch vụ thành công!");
            setServiceForm({ serviceName: "", description: "" });
            setEditingService(null);
            setShowServiceModal(false);
            loadData();
            setTimeout(() => setSuccess(""), 3000);
        } catch (error: any) {
            setError(error.message || "Failed to update service");
            setTimeout(() => setError(""), 3000);
        }
    };

    const handleDeleteService = async (serviceId: string) => {
        if (
            window.confirm(
                "Bạn có chắc muốn xóa dịch vụ này? Tất cả tùy chọn dịch vụ liên quan cũng sẽ bị xóa."
            )
        ) {
            try {
                await serviceService.deleteService(serviceId);
                setSuccess("Xóa dịch vụ thành công!");
                loadData();
                setTimeout(() => setSuccess(""), 3000);
            } catch (error: any) {
                setError(error.message || "Failed to delete service");
                setTimeout(() => setError(""), 3000);
            }
        }
    };

    // API handlers for service options
    const handleCreateOption = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await serviceOptionService.create(optionForm);
            setSuccess("Thêm tùy chọn dịch vụ thành công!");
            setOptionForm({
                serviceId: "",
                optionName: "",
                price: 0,
                description: "",
            });
            setShowOptionModal(false);
            loadData();
            setTimeout(() => setSuccess(""), 3000);
        } catch (error: any) {
            setError(error.message || "Failed to create service option");
            setTimeout(() => setError(""), 3000);
        }
    };

    const handleUpdateOption = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingOption) return;

        try {
            await serviceOptionService.update(
                editingOption.optionId,
                optionForm
            );
            setSuccess("Cập nhật tùy chọn dịch vụ thành công!");
            setOptionForm({
                serviceId: "",
                optionName: "",
                price: 0,
                description: "",
            });
            setEditingOption(null);
            setShowOptionModal(false);
            loadData();
            setTimeout(() => setSuccess(""), 3000);
        } catch (error: any) {
            setError(error.message || "Failed to update service option");
            setTimeout(() => setError(""), 3000);
        }
    };

    const handleDeleteOption = async (optionId: string) => {
        if (window.confirm("Bạn có chắc muốn xóa tùy chọn dịch vụ này?")) {
            try {
                await serviceOptionService.delete(optionId);
                setSuccess("Xóa tùy chọn dịch vụ thành công!");
                loadData();
                setTimeout(() => setSuccess(""), 3000);
            } catch (error: any) {
                setError(error.message || "Failed to delete service option");
                setTimeout(() => setError(""), 3000);
            }
        }
    };

    const handleEditService = (service: Service) => {
        setEditingService(service);
        setServiceForm({
            serviceName: service.serviceName,
            description: service.description || "",
        });
        setShowServiceModal(true);
    };

    const handleEditOption = (option: ServiceOption) => {
        setEditingOption(option);
        setOptionForm({
            serviceId: option.serviceId,
            optionName: option.optionName,
            price: option.price || 0,
            description: option.description || "",
        });
        setShowOptionModal(true);
    };

    // Filter services and options
    const filteredServices = services.filter((service) =>
        service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getOptionsForService = (serviceId: string) => {
        return serviceOptions.filter(
            (option) => option.serviceId === serviceId
        );
    };

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#7bb12b]"></div>
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
                <h1 className="text-3xl font-semibold mb-8">
                    Quản Lý Dịch Vụ Chăm Sóc
                </h1>

                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <div className="mb-6 flex justify-between items-center">
                    <input
                        type="text"
                        placeholder="Tìm kiếm dịch vụ..."
                        className="w-full max-w-md px-4 py-2 border rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                setEditingService(null);
                                setServiceForm({
                                    serviceName: "",
                                    description: "",
                                });
                                setShowServiceModal(true);
                            }}
                            className="bg-[#7bb12b] text-white px-6 py-2 rounded-full font-medium hover:bg-[#6aa11e] transition"
                        >
                            Thêm Dịch Vụ
                        </button>
                        <button
                            onClick={() => {
                                setEditingOption(null);
                                setOptionForm({
                                    serviceId: "",
                                    optionName: "",
                                    price: 0,
                                    description: "",
                                });
                                setShowOptionModal(true);
                            }}
                            className="bg-[#1797a6] text-white px-6 py-2 rounded-full font-medium hover:bg-[#127c8a] transition"
                        >
                            Thêm Tùy Chọn Dịch Vụ
                        </button>
                    </div>
                </div>

                {/* Services and Options table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left">
                                    Tên dịch vụ
                                </th>
                                <th className="px-6 py-3 text-left">
                                    Mô tả dịch vụ
                                </th>
                                <th className="px-6 py-3 text-left">
                                    Tùy chọn
                                </th>
                                <th className="px-6 py-3 text-left">Giá</th>
                                <th className="px-6 py-3 text-left">
                                    Mô tả tùy chọn
                                </th>
                                <th className="px-6 py-3 text-center">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredServices.map((service) => {
                                const options = getOptionsForService(
                                    service.serviceId
                                );

                                if (options.length === 0) {
                                    // Show service without options
                                    return (
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
                                            <td className="px-6 py-4 text-gray-500">
                                                Chưa có tùy chọn
                                            </td>
                                            <td className="px-6 py-4">-</td>
                                            <td className="px-6 py-4">-</td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleEditService(
                                                                service
                                                            )
                                                        }
                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                    >
                                                        Sửa dịch vụ
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteService(
                                                                service.serviceId
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-800 text-sm"
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }

                                // Show service with all its options
                                return options.map((option, index) => (
                                    <tr
                                        key={`${service.serviceId}-${option.optionId}`}
                                        className="hover:bg-gray-50"
                                    >
                                        {index === 0 && (
                                            <>
                                                <td
                                                    className="px-6 py-4 font-medium"
                                                    rowSpan={options.length}
                                                >
                                                    {service.serviceName}
                                                </td>
                                                <td
                                                    className="px-6 py-4"
                                                    rowSpan={options.length}
                                                >
                                                    {service.description ||
                                                        "Không có mô tả"}
                                                </td>
                                            </>
                                        )}
                                        <td className="px-6 py-4">
                                            {option.optionName}
                                        </td>
                                        <td className="px-6 py-4 text-green-600 font-medium">
                                            {option.price
                                                ? formatPrice(option.price)
                                                : "Chưa định giá"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {option.description ||
                                                "Không có mô tả"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                {index === 0 && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                handleEditService(
                                                                    service
                                                                )
                                                            }
                                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                                        >
                                                            Sửa dịch vụ
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteService(
                                                                    service.serviceId
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-800 text-sm"
                                                        >
                                                            Xóa dịch vụ
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() =>
                                                        handleEditOption(option)
                                                    }
                                                    className="text-purple-600 hover:text-purple-800 text-sm"
                                                >
                                                    Sửa tùy chọn
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteOption(
                                                            option.optionId
                                                        )
                                                    }
                                                    className="text-orange-600 hover:text-orange-800 text-sm"
                                                >
                                                    Xóa tùy chọn
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ));
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredServices.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        Không tìm thấy dịch vụ nào
                    </div>
                )}
            </main>

            {/* Service Form Modal */}
            {showServiceModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h2 className="text-xl font-semibold mb-4">
                            {editingService
                                ? "Chỉnh Sửa Dịch Vụ"
                                : "Thêm Dịch Vụ Mới"}
                        </h2>
                        <form
                            onSubmit={
                                editingService
                                    ? handleUpdateService
                                    : handleCreateService
                            }
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Tên dịch vụ{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border rounded px-3 py-2"
                                    value={serviceForm.serviceName}
                                    onChange={(e) =>
                                        setServiceForm((prev) => ({
                                            ...prev,
                                            serviceName: e.target.value,
                                        }))
                                    }
                                    placeholder="Nhập tên dịch vụ"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Mô tả
                                </label>
                                <textarea
                                    rows={3}
                                    className="w-full border rounded px-3 py-2"
                                    value={serviceForm.description}
                                    onChange={(e) =>
                                        setServiceForm((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    placeholder="Nhập mô tả dịch vụ"
                                />
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowServiceModal(false);
                                        setEditingService(null);
                                    }}
                                    className="px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="bg-[#7bb12b] text-white px-6 py-2 rounded-full hover:bg-[#6aa11e]"
                                >
                                    {editingService
                                        ? "Lưu thay đổi"
                                        : "Thêm dịch vụ"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Service Option Form Modal */}
            {showOptionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h2 className="text-xl font-semibold mb-4">
                            {editingOption
                                ? "Chỉnh Sửa Tùy Chọn Dịch Vụ"
                                : "Thêm Tùy Chọn Dịch Vụ Mới"}
                        </h2>
                        <form
                            onSubmit={
                                editingOption
                                    ? handleUpdateOption
                                    : handleCreateOption
                            }
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Dịch vụ{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    className="w-full border rounded px-3 py-2"
                                    value={optionForm.serviceId}
                                    onChange={(e) =>
                                        setOptionForm((prev) => ({
                                            ...prev,
                                            serviceId: e.target.value,
                                        }))
                                    }
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
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Tên tùy chọn{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border rounded px-3 py-2"
                                    value={optionForm.optionName}
                                    onChange={(e) =>
                                        setOptionForm((prev) => ({
                                            ...prev,
                                            optionName: e.target.value,
                                        }))
                                    }
                                    placeholder="Nhập tên tùy chọn"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Giá (VND)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full border rounded px-3 py-2"
                                    value={optionForm.price}
                                    onChange={(e) =>
                                        setOptionForm((prev) => ({
                                            ...prev,
                                            price: Number(e.target.value),
                                        }))
                                    }
                                    placeholder="Nhập giá"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Mô tả
                                </label>
                                <textarea
                                    rows={3}
                                    className="w-full border rounded px-3 py-2"
                                    value={optionForm.description}
                                    onChange={(e) =>
                                        setOptionForm((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    placeholder="Nhập mô tả tùy chọn"
                                />
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowOptionModal(false);
                                        setEditingOption(null);
                                    }}
                                    className="px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="bg-[#1797a6] text-white px-6 py-2 rounded-full hover:bg-[#127c8a]"
                                >
                                    {editingOption
                                        ? "Lưu thay đổi"
                                        : "Thêm tùy chọn"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
