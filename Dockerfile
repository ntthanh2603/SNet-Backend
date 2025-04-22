# Bắt đầu từ image Node.js
FROM node:20

# Đặt thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install --legacy-peer-deps

# Cài đặt Nest CLI toàn cục
RUN npm install -g @nestjs/cli

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Chạy ứng dụng NestJS
CMD ["npm", "run", "start:dev"]
