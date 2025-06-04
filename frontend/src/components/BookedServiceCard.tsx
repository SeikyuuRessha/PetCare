import React from 'react';
import PetComponent from '../Component/PetComponent';

interface BookedServiceCardProps {
  pet: {
    id: string;
    name: string;
    owner: string;
    species: string;
    breed: string;
    imageUrl: string;
  };
  service: {
    title: string;
    description: string;
    price: string;
    features: string[];
    type: 'Pet Care' | 'Pet Care & Veterinary';
    serviceDetails?: {
      date?: string;
      time?: string;
      startDate?: string; // for boarding service
      endDate?: string; // for boarding service
      room?: string; // for boarding service
      notes?: string;
      totalAmount?: string;
    };
  };
  status?: string;
}

export default function BookedServiceCard({
  pet,
  service,
  status = 'Đã thanh toán'
}: BookedServiceCardProps) {
  const isBoardingService = service.title.toLowerCase().includes('gửi');

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Service and Pet Info */}
        <div className="lg:w-2/3 space-y-6">
          {/* Service Title & Price */}
          <div className="bg-[#f8faf7] rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[#1797a6] text-sm">{service.type}</span>
                <h3 className="font-semibold text-2xl">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
              <div className="text-[#ff3c00] text-2xl font-bold">
                {service.serviceDetails?.totalAmount || service.price}
              </div>
            </div>
          </div>

          {/* Pet Info */}
          <div className="bg-[#f8faf7] rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="w-[100px] shrink-0">
                <PetComponent 
                  pet={pet}
                  onViewDetails={() => {}}
                  hideViewDetails={true}
                />
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 flex-1">
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Booking Details */}
        <div className="lg:w-1/3 bg-[#f8faf7] rounded-lg p-4">
          <h4 className="font-semibold mb-4">Chi tiết đặt lịch</h4>
          <div className="space-y-4">
            {isBoardingService ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-500 text-sm block">Ngày gửi:</label>
                    <div className="font-medium">{service.serviceDetails?.startDate}</div>
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm block">Ngày đón:</label>
                    <div className="font-medium">{service.serviceDetails?.endDate}</div>
                  </div>
                </div>
                <div>
                  <label className="text-gray-500 text-sm block">Phòng:</label>
                  <div className="font-medium">{service.serviceDetails?.room}</div>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-500 text-sm block">Ngày:</label>
                  <div className="font-medium">{service.serviceDetails?.date}</div>
                </div>
                <div>
                  <label className="text-gray-500 text-sm block">Giờ:</label>
                  <div className="font-medium">{service.serviceDetails?.time}</div>
                </div>
              </div>
            )}

            {service.serviceDetails?.notes && (
              <div>
                <label className="text-gray-500 text-sm block">Ghi chú:</label>
                <div className="mt-1 p-2 bg-white rounded text-sm">
                  {service.serviceDetails.notes}
                </div>
              </div>
            )}

            <div className="pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Trạng thái:</span>
                <span className="text-green-600 font-semibold">{status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
