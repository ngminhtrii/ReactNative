const localIP = '192.168.2.14'; // Đặt IP nội bộ của bạn tại đây
const port = 5000;

const config = {
  baseURL: `http://${localIP}:${port}/api`, // /api nếu backend của bạn dùng prefix đó
};

export default config;
