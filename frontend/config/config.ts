const localIP = '192.168.211.78'; // Đặt IP nội bộ của bạn tại đây
const port = 5005;

const config = {
  baseURL: `http://${localIP}:${port}/api`, // /api nếu backend của bạn dùng prefix đó
};

export default config;
