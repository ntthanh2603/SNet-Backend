import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  // Lưu dữ liệu vào cache với TTL (mặc định 10 phút)
  async set(key: string, value: any, ttl = 600): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
  }

  // Lấy dữ liệu từ cache
  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  // Xóa cache theo key
  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  // Xóa tất cả key theo pattern (cẩn thận khi dùng)
  async clear(pattern = '*'): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length) {
      await this.redis.del(...keys);
    }
  }

  // Lấy tất cả key (để debug)
  async getAllKeys(pattern = '*'): Promise<string[]> {
    return this.redis.keys(pattern);
  }

  async increment(key: string): Promise<number> {
    return await this.redis.incr(key);
  }

  async decrement(key: string): Promise<number> {
    const value = await this.redis.decr(key);
    return value >= 0 ? value : 0; // Đảm bảo số lượng không âm
  }

  // Kiểm tra kết nối Redis
  async onModuleInit() {
    try {
      await this.redis.ping();
      console.log('Redis connection successful');
    } catch (error) {
      console.error('Redis connection failed:', error);
    }
  }
}
