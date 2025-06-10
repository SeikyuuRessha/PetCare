import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
    serviceOptionService,
    ServiceOption,
} from "../../services/serviceOptionService";
import Header from "../../components/layouts/Header";

const EmployeeServiceOptionsPage: React.FC = () => {
    const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingOption, setEditingOption] = useState<ServiceOption | null>(
        null
    );
    const [formData, setFormData] = useState({
        serviceId: "",
        optionName: "",
        description: "",
        price: 0,
    });

    useEffect(() => {
        loadServiceOptions();
    }, []);

    const loadServiceOptions = async () => {
        try {
            const options = await serviceOptionService.getAll();
            setServiceOptions(options);
        } catch (error) {
            toast.error("Không thể tải danh sách tùy chọn dịch vụ");
            console.error("Error loading service options:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.optionName || !formData.serviceId) {
            toast.error("Vui lòng điền đầy đủ thông tin");
            return;
        }

        try {
            if (editingOption) {
                await serviceOptionService.update(
                    editingOption.optionId,
                    formData
                );
                toast.success("Cập nhật tùy chọn dịch vụ thành công");
            } else {
                await serviceOptionService.create(formData);
                toast.success("Thêm tùy chọn dịch vụ thành công");
            }

            resetForm();
            loadServiceOptions();
        } catch (error) {
            toast.error(
                editingOption
                    ? "Không thể cập nhật tùy chọn dịch vụ"
                    : "Không thể thêm tùy chọn dịch vụ"
            );
            console.error("Error saving service option:", error);
        }
    };

    const handleEdit = (option: ServiceOption) => {
        setEditingOption(option);
        setFormData({
            serviceId: option.serviceId || "",
            optionName: option.optionName,
            description: option.description || "",
            price: option.price || 0,
        });
        setShowAddModal(true);
    };

    const handleDelete = async (optionId: string) => {
        if (
            !window.confirm("Bạn có chắc chắn muốn xóa tùy chọn dịch vụ này?")
        ) {
            return;
        }

        try {
            await serviceOptionService.delete(optionId);
            toast.success("Xóa tùy chọn dịch vụ thành công");
            loadServiceOptions();
        } catch (error) {
            toast.error("Không thể xóa tùy chọn dịch vụ");
            console.error("Error deleting service option:", error);
        }
    };

    const resetForm = () => {
        setFormData({
            serviceId: "",
            optionName: "",
            description: "",
            price: 0,
        });
        setEditingOption(null);
        setShowAddModal(false);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
                    <div className="text-lg">Đang tải...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Quản Lý Tùy Chọn Dịch Vụ
                        </h1>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Thêm Tùy Chọn Mới
                        </button>
                    </div>

                    {/* Service Options Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-3 text-left">
                                        Tên Tùy Chọn
                                    </th>
                                    <th className="border p-3 text-left">
                                        Dịch Vụ
                                    </th>
                                    <th className="border p-3 text-left">
                                        Mô Tả
                                    </th>
                                    <th className="border p-3 text-left">
                                        Giá
                                    </th>
                                    <th className="border p-3 text-center">
                                        Thao Tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {serviceOptions.map((option) => (
                                    <tr
                                        key={option.optionId}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="border p-3 font-medium">
                                            {option.optionName}
                                        </td>
                                        <td className="border p-3">
                                            {option.service?.serviceName ||
                                                "N/A"}
                                        </td>
                                        <td className="border p-3">
                                            {option.description || "N/A"}
                                        </td>
                                        <td className="border p-3 text-green-600 font-semibold">
                                            {formatPrice(option.price || 0)}
                                        </td>
                                        <td className="border p-3 text-center">
                                            <button
                                                onClick={() =>
                                                    handleEdit(option)
                                                }
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2 text-sm transition-colors"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        option.optionId
                                                    )
                                                }
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {serviceOptions.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                Chưa có tùy chọn dịch vụ nào được tạo
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            {editingOption
                                ? "Cập Nhật Tùy Chọn Dịch Vụ"
                                : "Thêm Tùy Chọn Dịch Vụ Mới"}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ID Dịch Vụ *
                                </label>
                                <input
                                    type="text"
                                    value={formData.serviceId}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            serviceId: e.target.value,
                                        })
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên Tùy Chọn *
                                </label>
                                <input
                                    type="text"
                                    value={formData.optionName}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            optionName: e.target.value,
                                        })
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mô Tả
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Giá (VNĐ)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            price:
                                                parseInt(e.target.value) || 0,
                                        })
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    {editingOption ? "Cập Nhật" : "Thêm Mới"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeServiceOptionsPage;
