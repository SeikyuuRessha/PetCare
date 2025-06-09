import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { jsPDF } from 'jspdf';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function StatisticsPage() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  // Mock data
  const data = {
    week: {
      labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
      revenue: [1200000, 1500000, 1300000, 1800000, 2000000, 2500000, 1900000],
      growth: 15.5
    },
    month: {
      labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
      revenue: [8000000, 9500000, 10200000, 11500000],
      growth: 20.3
    },
    year: {
      labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
      revenue: [
        25000000, 28000000, 30000000, 27000000,
        32000000, 35000000, 40000000, 38000000,
        42000000, 45000000, 48000000, 50000000
      ],
      growth: 25.8
    }
  };

  const chartData: ChartData<'line'> = {
    labels: data[timeRange].labels,
    datasets: [
      {
        label: 'Doanh thu (VNĐ)',
        data: data[timeRange].revenue,
        borderColor: '#7bb12b',
        backgroundColor: 'rgba(123, 177, 43, 0.5)',
        tension: 0.4
      }
    ]
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Biểu đồ doanh thu'
      }
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Báo cáo thống kê doanh thu', 20, 20);

    // Add time range
    doc.setFontSize(14);
    doc.text(`Thời gian: ${timeRange === 'week' ? 'Tuần' : timeRange === 'month' ? 'Tháng' : 'Năm'}`, 20, 40);

    // Add revenue data
    doc.setFontSize(12);
    const revenues = data[timeRange].revenue;
    doc.text(`Tổng doanh thu: ${revenues.reduce((a, b) => a + b, 0).toLocaleString('vi-VN')} VNĐ`, 20, 60);
    doc.text(`Tăng trưởng: ${data[timeRange].growth}%`, 20, 70);

    // Save the PDF
    doc.save('revenue-report.pdf');
  };

  return (
    <div className="font-sans bg-white min-h-screen">
      {/* Top bar */}
      <div className="bg-[#7bb12b] text-white text-xs flex justify-between items-center px-8 py-1">
        <span>Welcome To Admin Panel</span>
      </div>

      {/* Back button */}
      <div className="mt-8 ml-8">
        <button 
          onClick={() => navigate('/admin')}
          className="flex items-center text-[#7bb12b] hover:text-[#5d990f]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="ml-2">Quay lại</span>
        </button>
      </div>

      <main className="px-8 py-6">
        <h1 className="text-3xl font-semibold mb-8">Báo Cáo Thống Kê</h1>
        
        {/* Time range selector */}
        <div className="mb-6 flex gap-4">
          {['week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range as 'week' | 'month' | 'year')}
              className={`px-6 py-2 rounded-full ${
                timeRange === range 
                  ? 'bg-[#7bb12b] text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {range === 'week' ? 'Tuần' : range === 'month' ? 'Tháng' : 'Năm'}
            </button>
          ))}
        </div>

        {/* Statistics cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md border">
            <h3 className="text-lg font-semibold mb-2">Tổng doanh thu</h3>
            <p className="text-2xl text-[#7bb12b]">
              {data[timeRange].revenue.reduce((a, b) => a + b, 0).toLocaleString('vi-VN')} VNĐ
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md border">
            <h3 className="text-lg font-semibold mb-2">Tăng trưởng</h3>
            <p className="text-2xl text-[#7bb12b]">+{data[timeRange].growth}%</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md border">
            <h3 className="text-lg font-semibold mb-2">Số lượng dịch vụ</h3>
            <p className="text-2xl text-[#7bb12b]">156</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md border mb-8">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Export button */}
        <div className="flex justify-end">
          <button
            onClick={generatePDF}
            className="bg-[#7bb12b] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#5d990f] transition"
          >
            Xuất báo cáo PDF
          </button>
        </div>
      </main>
    </div>
  );
}
