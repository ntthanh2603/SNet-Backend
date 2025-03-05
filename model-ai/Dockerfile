# Sử dụng Python 3.10 (hoặc phiên bản phù hợp với ứng dụng của bạn)
FROM python:3.10

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy toàn bộ mã nguồn vào container
COPY . .

# Cập nhật pip và cài đặt các thư viện cần thiết
# RUN pip install --no-cache-dir --upgrade pip && \
RUN pip install -r requirements.txt

# Expose cổng 8000 để service có thể truy cập
EXPOSE 8000

# Chạy FastAPI với Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
