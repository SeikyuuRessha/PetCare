import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { medicineService, Medicine, CreateMedicineData, UpdateMedicineData } from '../../services/medicineService';
import { medicationPackageService, MedicationPackage, CreateMedicationPackageDto } from '../../services/medicationPackageService';

export default function EmployeeMedicinesPage() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [packages, setPackages] = useState<MedicationPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showMedicineForm, setShowMedicineForm] = useState(false);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Medicine form state - đồng bộ với backend schema
  const [medicineForm, setMedicineForm] = useState<CreateMedicineData>({
    name: '',
    unit: '',
    concentration: ''
  });

  // Package form state - đồng bộ với backend schema
  const [packageForm, setPackageForm] = useState<CreateMedicationPackageDto>({
    medicineId: '',
    quantity: 0,
    instruction: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [medicinesData, packagesData] = await Promise.all([
        medicineService.getAll(),
        medicationPackageService.getAll()
      ]);
      setMedicines(medicinesData);
      setPackages(packagesData);
    } catch (error: any) {
      setError(error.message || 'Failed to load data');
      if (error?.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMedicine) {
        await medicineService.update(editingMedicine.medicineId, medicineForm as UpdateMedicineData);
        setSuccess('Cập nhật thuốc thành công!');
      } else {
        await medicineService.create(medicineForm);
        setSuccess('Thêm thuốc thành công!');
      }
      
      setMedicineForm({ name: '', unit: '', concentration: '' });
      setEditingMedicine(null);
      setShowMedicineForm(false);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error.message || 'Failed to save medicine');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await medicationPackageService.create(packageForm);
      setSuccess('Thêm gói thuốc thành công!');
      setPackageForm({
        medicineId: '',
        quantity: 0,
        instruction: ''
      });
      setShowPackageForm(false);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error.message || 'Failed to create package');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteMedicine = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thuốc này?')) {
      try {
        await medicineService.delete(id);
        setSuccess('Xóa thuốc thành công!');
        loadData();
        setTimeout(() => setSuccess(''), 3000);
      } catch (error: any) {
        setError(error.message || 'Failed to delete medicine');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa gói thuốc này?')) {
      try {
        await medicationPackageService.delete(id);
        setSuccess('Xóa gói thuốc thành công!');
        loadData();
        setTimeout(() => setSuccess(''), 3000);
      } catch (error: any) {
        setError(error.message || 'Failed to delete package');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handleEditMedicine = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setMedicineForm({
      name: medicine.name,
      unit: medicine.unit || '',
      concentration: medicine.concentration || ''
    });
    setShowMedicineForm(true);
  };

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (medicine.concentration && medicine.concentration.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="font-sans bg-white min-h-screen">
      {/* Top green bar */}
      <div className="bg-[#7bb12b] text-white text-xs flex justify-between items-center px-0 md:px-8 py-1">
        <span className="ml-4">Welcome To Our Pet Store</span>
        <span className="flex items-center gap-2 mr-4">
          <span>Currency: $USD</span>
          <span>|</span>
          <span>Account <span className="align-super text-[10px]">▼</span></span>
        </span>
      </div>

      {/* Back arrow */}
      <div 
        className="mt-8 ml-8 cursor-pointer"
        onClick={() => navigate('/employee')}
      >
        <svg width="60" height="32" viewBox="0 0 60 32" fill="none">
          <path d="M40 16H8M8 16L20 28M8 16L20 4" stroke="#7bb12b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Title */}
      <div className="flex justify-center mt-2 mb-8">
        <div className="bg-[#7bb12b] text-white text-3xl font-normal rounded-xl px-16 py-4 shadow border border-black">
          QUẢN LÝ THUỐC (NHÂN VIÊN)
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="mx-4 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mx-4 mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Main Content */}
      <main className="px-4 max-w-7xl mx-auto">
        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setShowMedicineForm(true)}
            className="bg-[#7bb12b] text-white px-6 py-2 rounded-lg hover:bg-[#6ba024] transition"
          >
            Thêm thuốc mới
          </button>
          <button
            onClick={() => setShowPackageForm(true)}
            className="bg-[#1797a6] text-white px-6 py-2 rounded-lg hover:bg-[#127c8a] transition"
          >
            Thêm gói thuốc
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm thuốc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border rounded-lg"
          />
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="text-lg">Đang tải...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Medicines Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Danh sách thuốc ({filteredMedicines.length})</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredMedicines.map((medicine) => (
                  <div key={medicine.medicineId} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{medicine.name}</h3>
                        <div className="mt-2 flex gap-4 text-sm">
                          {medicine.unit && <span>Đơn vị: <strong>{medicine.unit}</strong></span>}
                          {medicine.concentration && <span>Nồng độ: <strong>{medicine.concentration}</strong></span>}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEditMedicine(medicine)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteMedicine(medicine.medicineId)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredMedicines.length === 0 && (
                  <div className="text-center py-8 text-gray-600">
                    Không tìm thấy thuốc nào
                  </div>
                )}
              </div>
            </div>

            {/* Packages Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Gói thuốc ({packages.length})</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {packages.map((pkg) => (
                  <div key={pkg.packageId} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold">{pkg.medicine?.name || 'Unknown Medicine'}</h3>
                        <div className="mt-2 text-sm">
                          <div>Số lượng: <strong>{pkg.quantity} {pkg.medicine?.unit || 'units'}</strong></div>
                          {pkg.instruction && (
                            <div className="text-xs text-gray-500 mt-1">{pkg.instruction}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleDeletePackage(pkg.packageId)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {packages.length === 0 && (
                  <div className="text-center py-8 text-gray-600">
                    Chưa có gói thuốc nào
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Medicine Form Modal */}
      {showMedicineForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">
              {editingMedicine ? 'Chỉnh sửa thuốc' : 'Thêm thuốc mới'}
            </h2>
            <form onSubmit={handleCreateMedicine}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên thuốc *</label>
                  <input
                    type="text"
                    required
                    value={medicineForm.name}
                    onChange={(e) => setMedicineForm({...medicineForm, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Đơn vị</label>
                  <input
                    type="text"
                    value={medicineForm.unit}
                    onChange={(e) => setMedicineForm({...medicineForm, unit: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Ví dụ: viên, ml, gói"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nồng độ</label>
                  <input
                    type="text"
                    value={medicineForm.concentration}
                    onChange={(e) => setMedicineForm({...medicineForm, concentration: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Ví dụ: 250mg, 10%"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowMedicineForm(false);
                    setEditingMedicine(null);
                    setMedicineForm({ name: '', unit: '', concentration: '' });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#7bb12b] text-white rounded-lg hover:bg-[#6ba024]"
                >
                  {editingMedicine ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Package Form Modal */}
      {showPackageForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Thêm gói thuốc</h2>
            <form onSubmit={handleCreatePackage}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Thuốc *</label>
                  <select
                    required
                    value={packageForm.medicineId}
                    onChange={(e) => setPackageForm({...packageForm, medicineId: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Chọn thuốc</option>
                    {medicines.map((medicine) => (
                      <option key={medicine.medicineId} value={medicine.medicineId}>
                        {medicineService.formatMedicineName(medicine)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số lượng trong gói *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={packageForm.quantity}
                    onChange={(e) => setPackageForm({...packageForm, quantity: Number(e.target.value)})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hướng dẫn sử dụng</label>
                  <textarea
                    value={packageForm.instruction}
                    onChange={(e) => setPackageForm({...packageForm, instruction: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                    placeholder="Hướng dẫn cách sử dụng thuốc..."
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowPackageForm(false);
                    setPackageForm({
                      medicineId: '',
                      quantity: 0,
                      instruction: ''
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#1797a6] text-white rounded-lg hover:bg-[#127c8a]"
                >
                  Thêm gói
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
