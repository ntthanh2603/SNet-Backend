// Code chạy test kết nối tới WebSocket server
// Chạy CLI: node test/socket.js
import { io } from 'socket.io-client';

// URL của WebSocket server
const SOCKET_URL = 'ws://localhost:3000/chat';

// Kết nối tới WebSocket server
const socket = io(SOCKET_URL, {
  reconnection: true, // Tự động reconnect nếu mất kết nối
  reconnectionAttempts: 5, // Thử reconnect tối đa 5 lần
  reconnectionDelay: 5000, // Đợi 5 giây trước khi thử lại
  transports: ['websocket'], // Chỉ dùng WebSocket, không dùng polling
  extraHeaders: {
    Authorization:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNmN2Q4NDNiLTY5NjgtNDhjZi1iMzVlLTkxN2I5YzJmMTkxOCIsImRldmljZVNlY3NzaW9uSWQiOiIyODIyNjA4YS1lZTBjLTQ3ODktYjAxOS00Y2NlNTA0MmYzZWIiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0MjgwNDMwMiwiZXhwIjoxNzQzMjM2MzAyfQ.6Hx1cVuzLMCPbRJijv7CptohHkbJlwGL9nUfMgAPifE',
  },
});

// Sự kiện khi kết nối thành công
socket.on('connect', () => {
  console.log(`✅ Connected to WebSocket server! Socket ID: ${socket.id}`);

  // Gửi tin nhắn sau khi kết nối thành công
  socket.emit('message', { text: 'Hello from client!' });
});

// Nhận tin nhắn từ server
socket.on('message', (data) => {
  console.log('📩 Received message from server:', data);
});

// Lắng nghe sự kiện lỗi
socket.on('connect_error', (err) => {
  console.error('❌ Connection error:', err.message);
});

// Lắng nghe sự kiện mất kết nối
socket.on('disconnect', (reason) => {
  console.warn('⚠️ Disconnected:', reason);
});

// Gửi ping mỗi 5 giây để giữ kết nối
// setInterval(() => {
//   socket.emit('ping');
//   console.log('🔄 Sent ping to server...');
// }, 5000);
