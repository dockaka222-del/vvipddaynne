import React from 'react';

const UserManagementPage: React.FC = () => {
  // Trong tương lai, bạn sẽ fetch danh sách người dùng từ API ở đây
  const users = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@vipdayne.net',
      role: 'admin',
      isVerified: true,
    },
    {
      id: '2',
      username: 'user',
      email: 'user@vipdayne.net',
      role: 'user',
      isVerified: true,
    },
    {
      id: '3',
      username: 'newuser',
      email: 'new@example.com',
      role: 'user',
      isVerified: false,
    },
  ];

  // Logic tìm kiếm và phân trang sẽ được thêm vào đây

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý Người dùng</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left p-4 font-semibold">Tên người dùng</th>
              <th className="text-left p-4 font-semibold">Email</th>
              <th className="text-left p-4 font-semibold">Vai trò</th>
              <th className="text-left p-4 font-semibold">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td className="p-4">{user.username}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  {user.isVerified ? (
                    <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                      Đã xác thực
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
                      Chờ xác thực
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementPage;
