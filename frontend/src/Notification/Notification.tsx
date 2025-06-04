import React from 'react';

export default function Notification() {
  return (
    <div className="bg-white rounded-2xl px-8 py-6 w-[400px] border border-gray-200 shadow-lg">
      <div className="text-lg font-medium mb-4 text-[#1797a6]">
        Thông báo
      </div>
      <div className="space-y-4">
        <div className="bg-[#f8f8f8] p-4 rounded-lg border-l-4 border-[#7bb12b]">
          <div className="text-sm text-gray-600">
            Lịch khám của bạn đã được xác nhận
          </div>
          <div className="text-xs text-gray-400 mt-1">2 phút trước</div>
        </div>
        <div className="bg-[#f8f8f8] p-4 rounded-lg border-l-4 border-[#1797a6]">
          <div className="text-sm text-gray-600">
            Đơn hàng dịch vụ đang được xử lý
          </div>
          <div className="text-xs text-gray-400 mt-1">15 phút trước</div>
        </div>
      </div>
    </div>
  );
}
