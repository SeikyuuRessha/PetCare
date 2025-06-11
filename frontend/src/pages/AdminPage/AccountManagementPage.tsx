import { User, userService } from '../../services/userService';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface IUser {
  userId: string;
  username: string;
  email: string;
  role: 'admin' | 'doctor' | 'user';
}

export default function AccountManagementPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
          
      
        
        let data: User[] = await userService.getAllUsers();
        console.log("Fetched users:", data);
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        // Optionally, set an error state here to display to the user
      }
    };

    fetchUsers();
  }, []); // Empty dependency array means this effect runs once on mount

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleChangeRole = (userId: string, newRole: 'admin' | 'doctor' | 'user') => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Bạn có chắc muốn xóa tài khoản này?')) {
      await userService.deleteUser(userId);
      setUsers(users.filter(user => user.userId !== userId));
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-3xl font-semibold mb-8">Quản Lý Tài Khoản</h1>
        
        {/* Search bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm theo username hoặc email..."
            className="w-full max-w-md px-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Users table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Username</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Chức vụ</th>
                <th className="px-6 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{user.id}</td>
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleChangeRole(user.id, e.target.value as 'admin' | 'doctor' | 'user')}
                      className="border rounded px-2 py-1"
                    >
                      <option value="admin">Admin</option>
                      <option value="doctor">Bác sĩ</option>
                      <option value="user">Người dùng</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDelete(user.userId)}
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
      </main>
    </div>
  );
}
