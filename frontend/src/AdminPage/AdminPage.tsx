import React from 'react';

export default function AdminPage() {
  return (
    <div className="font-sans bg-white min-h-screen">
      {/* Top green bar */}
      <div className="bg-[#7bb12b] text-white text-xs flex justify-between items-center px-0 md:px-8 py-1">
        <span className="ml-4 flex items-center gap-2">
          Welcome To Our Pet Store
          <span className="inline-block ml-2"><i className="fa fa-truck" /></span>
          <span className="ml-2">Order Tracking</span>
        </span>
        <span className="flex items-center gap-2 mr-4">
          <span>Currency: $USD</span>
          <span>|</span>
          <span>Account <span className="align-super text-[10px]">▼</span></span>
        </span>
      </div>
      {/* Main Content */}
      <main>
        <h1 className="text-5xl font-light text-center mt-16 mb-12">ADMIN</h1>
        <div className="flex flex-col md:flex-row justify-center items-center gap-16 mt-8">
          <button
            className="bg-[#5d990f] text-white text-4xl rounded-2xl px-12 py-8 shadow-md border border-black hover:bg-[#7bb12b] transition min-w-[380px] mb-8 md:mb-0"
            style={{ boxShadow: '2px 4px 8px #8888' }}
          >
            Quản Lí Tài Khoản
          </button>
          <button
            className="bg-[#1797a6] text-white text-4xl rounded-2xl px-12 py-8 shadow-md border border-black hover:bg-[#127c8a] transition min-w-[480px]"
            style={{ boxShadow: '2px 4px 8px #8888' }}
          >
            Báo cáo thống kê
          </button>
        </div>
      </main>
    </div>
  );
}

export default AdminPage;