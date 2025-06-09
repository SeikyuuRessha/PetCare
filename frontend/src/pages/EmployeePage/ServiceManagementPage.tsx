import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ServicePackage {
  id: string;
  tier: 'dong' | 'bac' | 'vang' | 'kimcuong';
  name: string;
  price: number;
  description: string;
}

interface Service {
  id: string;
  name: string;
  packages: ServicePackage[];
  description: string;
}

export default function ServiceManagementPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingPackage, setEditingPackage] = useState<{
    serviceId: string;
    package: ServicePackage | null;
  }>({
    serviceId: '',
    package: null
  });
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Grooming',
      description: 'Dịch vụ cắt tỉa lông chuyên nghiệp',
      packages: [
        { 
          id: '1', 
          tier: 'dong',
          name: 'Gói Đồng', 
          price: 200000, 
          description: 'Cắt tỉa lông cơ bản, tắm rửa' 
        },
        { 
          id: '2', 
          tier: 'bac',
          name: 'Gói Bạc', 
          price: 350000, 
          description: 'Cắt tỉa + tắm spa + sấy khô' 
        },
        { 
          id: '3', 
          tier: 'vang',
          name: 'Gói Vàng', 
          price: 500000, 
          description: 'Full combo + massage + nhuộm lông' 
        },
        { 
          id: '4', 
          tier: 'kimcuong',
          name: 'Gói Kim Cương', 
          price: 800000, 
          description: 'Vip combo + spa cao cấp + dưỡng lông đặc biệt' 
        }
      ]
    },
    {
      id: '2',
      name: 'Pet Hotel',
      description: 'Dịch vụ trông giữ thú cưng',
      packages: [
        { 
          id: '5', 
          tier: 'dong',
          name: 'Gói Đồng', 
          price: 150000, 
          description: 'Phòng tiêu chuẩn, 2 bữa ăn' 
        },
        { 
          id: '6', 
          tier: 'bac',
          name: 'Gói Bạc', 
          price: 250000, 
          description: 'Phòng rộng, 3 bữa ăn + snack' 
        },
        { 
          id: '7', 
          tier: 'vang',
          name: 'Gói Vàng', 
          price: 400000, 
          description: 'Phòng VIP, full dịch vụ + spa' 
        },
        { 
          id: '8', 
          tier: 'kimcuong',
          name: 'Gói Kim Cương', 
          price: 600000, 
          description: 'Phòng President, chăm sóc 24/7 + dịch vụ cao cấp' 
        }
      ]
    }
  ]);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'dong': return 'bg-amber-700 text-white';
      case 'bac': return 'bg-gray-400 text-white';
      case 'vang': return 'bg-yellow-500 text-white';
      case 'kimcuong': return 'bg-blue-500 text-white';
      default: return 'bg-gray-100';
    }
  };

  const handleDelete = (serviceId: string) => {
    if (window.confirm('Bạn có chắc muốn xóa dịch vụ này?')) {
      setServices(prev => prev.filter(s => s.id !== serviceId));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const newService: Service = {
      id: editingService?.id || Date.now().toString(),
      name: formData.get('serviceName') as string,
      description: formData.get('serviceDescription') as string,
      packages: [
        {
          id: formData.get('packageId1')?.toString() || Date.now().toString(),
          tier: 'dong',
          name: 'Gói Đồng',
          price: Number(formData.get('packagePrice1')),
          description: formData.get('packageDescription1') as string,
        },
        {
          id: formData.get('packageId2')?.toString() || (Date.now() + 1).toString(),
          tier: 'bac',
          name: 'Gói Bạc',
          price: Number(formData.get('packagePrice2')),
          description: formData.get('packageDescription2') as string,
        },
        {
          id: formData.get('packageId3')?.toString() || (Date.now() + 2).toString(),
          tier: 'vang',
          name: 'Gói Vàng',
          price: Number(formData.get('packagePrice3')),
          description: formData.get('packageDescription3') as string,
        },
        {
          id: formData.get('packageId4')?.toString() || (Date.now() + 3).toString(),
          tier: 'kimcuong',
          name: 'Gói Kim Cương',
          price: Number(formData.get('packagePrice4')),
          description: formData.get('packageDescription4') as string,
        }
      ]
    };

    if (editingService) {
      setServices(prev => prev.map(s => s.id === editingService.id ? newService : s));
    } else {
      setServices(prev => [...prev, newService]);
    }
    
    setShowModal(false);
    setEditingService(null);
  };

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.packages.some(pkg => pkg.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="font-sans bg-white min-h-screen">
      {/* Top bar */}
      <div className="bg-[#7bb12b] text-white text-xs flex justify-between items-center px-8 py-1">
        <span>Employee Dashboard</span>
      </div>

      {/* Back button */}
      <div className="mt-8 ml-8">
        <button 
          onClick={() => navigate('/employee')}
          className="flex items-center text-[#7bb12b] hover:text-[#5d990f]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="ml-2">Quay lại</span>
        </button>
      </div>

      <main className="px-8 py-6">
        <h1 className="text-3xl font-semibold mb-8">Quản Lý Dịch Vụ Chăm Sóc</h1>

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
                setShowModal(true);
              }}
              className="bg-[#7bb12b] text-white px-6 py-2 rounded-full font-medium hover:bg-[#6aa11e] transition"
            >
              Thêm Dịch Vụ
            </button>
            <button
              onClick={() => {
                setEditingPackage({ serviceId: '', package: null });
                setShowModal(true);
              }}
              className="bg-[#1797a6] text-white px-6 py-2 rounded-full font-medium hover:bg-[#127c8a] transition"
            >
              Thêm Gói Dịch Vụ
            </button>
          </div>
        </div>

        {/* Services table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Tên dịch vụ</th>
                <th className="px-6 py-3 text-left">Gói dịch vụ</th>
                <th className="px-6 py-3 text-left">Giá</th>
                <th className="px-6 py-3 text-left">Mô tả</th>
                <th className="px-6 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredServices.map(service => (
                <React.Fragment key={service.id}>
                  {service.packages.map(pkg => (
                    <tr key={pkg.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{service.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${getTierColor(pkg.tier)}`}>
                          {pkg.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-green-600">
                        {pkg.price.toLocaleString('vi-VN')}đ
                      </td>
                      <td className="px-6 py-4">{pkg.description}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={() => {
                              setEditingPackage({
                                serviceId: service.id,
                                package: pkg
                              });
                              setShowModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Bạn có chắc muốn xóa gói dịch vụ này?')) {
                                setServices(prev => prev.map(s => 
                                  s.id === service.id 
                                    ? { ...s, packages: s.packages.filter(p => p.id !== pkg.id) }
                                    : s
                                ));
                              }
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Package Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">
              {editingPackage.package ? 'Chỉnh Sửa Gói Dịch Vụ' : 'Thêm Gói Dịch Vụ Mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Dịch vụ <span className="text-red-500">*</span>
                </label>
                <select
                  name="serviceId"
                  required
                  className="w-full border rounded px-3 py-2"
                  defaultValue={editingPackage.serviceId}
                >
                  <option value="">Chọn dịch vụ</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Loại gói <span className="text-red-500">*</span>
                </label>
                <select
                  name="tier"
                  required
                  className="w-full border rounded px-3 py-2"
                  defaultValue={editingPackage.package?.tier}
                >
                  <option value="dong">Gói Đồng</option>
                  <option value="bac">Gói Bạc</option>
                  <option value="vang">Gói Vàng</option>
                  <option value="kimcuong">Gói Kim Cương</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Giá <span className="text-red-500">*</span>
                </label>
                <input
                  name="price"
                  type="number"
                  required
                  className="w-full border rounded px-3 py-2"
                  defaultValue={editingPackage.package?.price}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  className="w-full border rounded px-3 py-2"
                  defaultValue={editingPackage.package?.description}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-[#7bb12b] text-white px-6 py-2 rounded-full hover:bg-[#6aa11e]"
                >
                  {editingPackage.package ? 'Lưu thay đổi' : 'Thêm gói'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
