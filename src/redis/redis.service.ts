// redis.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  /**
   * Lưu giá trị vào Redis
   * @param key - Khóa để lưu trữ giá trị
   * @param value - Giá trị cần lưu
   * @param ttl - Thời gian sống (tính bằng giây), tùy chọn
   */
  async set(key: string, value: string, ttl?: number): Promise<'OK'> {
    if (ttl) {
      return this.redis.set(key, value, 'EX', ttl);
    }
    return this.redis.set(key, value);
  }

  /**
   * Lấy giá trị từ Redis theo khóa
   * @param key - Khóa cần truy vấn
   * @returns Giá trị của khóa, hoặc null nếu không tồn tại
   */
  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  /**
   * Xóa một hoặc nhiều khóa khỏi Redis
   * @param keys - Các khóa cần xóa
   * @returns Số lượng khóa đã xóa thành công
   */
  async del(...keys: string[]): Promise<number> {
    return this.redis.del(keys);
  }

  /**
   * Kiểm tra xem khóa có tồn tại không
   * @param key - Khóa cần kiểm tra
   * @returns 1 nếu khóa tồn tại, 0 nếu không
   */
  async exists(key: string): Promise<number> {
    return this.redis.exists(key);
  }

  /**
   * Đặt thời gian sống cho khóa
   * @param key - Khóa cần đặt thời gian sống
   * @param seconds - Số giây
   * @returns 1 nếu thành công, 0 nếu khóa không tồn tại
   */
  async expire(key: string, seconds: number): Promise<number> {
    return this.redis.expire(key, seconds);
  }

  /**
   * Tăng giá trị số nguyên của khóa lên 1
   * @param key - Khóa cần tăng giá trị
   * @returns Giá trị sau khi tăng
   */
  async incr(key: string): Promise<number> {
    return this.redis.incr(key);
  }

  /**
   * Tăng giá trị số nguyên của khóa theo một số lượng nhất định
   * @param key - Khóa cần tăng giá trị
   * @param increment - Số lượng cần tăng
   * @returns Giá trị sau khi tăng
   */
  async incrBy(key: string, increment: number): Promise<number> {
    return this.redis.incrby(key, increment);
  }

  /**
   * Giảm giá trị số nguyên của khóa xuống 1
   * @param key - Khóa cần giảm giá trị
   * @returns Giá trị sau khi giảm
   */
  async decr(key: string): Promise<number> {
    return this.redis.decr(key);
  }

  /**
   * Giảm giá trị số nguyên của khóa theo một số lượng nhất định
   * @param key - Khóa cần giảm giá trị
   * @param decrement - Số lượng cần giảm
   * @returns Giá trị sau khi giảm
   */
  async decrBy(key: string, decrement: number): Promise<number> {
    return this.redis.decrby(key, decrement);
  }

  // ------ CÁC PHƯƠNG THỨC LÀM VIỆC VỚI HASH ------

  /**
   * Đặt một trường trong hash
   * @param key - Khóa của hash
   * @param field - Tên trường
   * @param value - Giá trị của trường
   * @returns 1 nếu trường được tạo mới, 0 nếu trường đã tồn tại và được cập nhật
   */
  async hSet(
    key: string,
    field: string,
    value: string | number,
  ): Promise<number> {
    return this.redis.hset(key, field, value.toString());
  }

  /**
   * Đặt nhiều trường trong hash cùng lúc
   * @param key - Khóa của hash
   * @param fieldValues - Object chứa các cặp trường/giá trị
   * @returns OK nếu thành công
   */
  async hMSet(key: string, fieldValues: Record<string, any>): Promise<'OK'> {
    return this.redis.hmset(key, fieldValues);
  }

  /**
   * Lấy giá trị của một trường trong hash
   * @param key - Khóa của hash
   * @param field - Tên trường
   * @returns Giá trị của trường, hoặc null nếu không tồn tại
   */
  async hGet(key: string, field: string): Promise<string | null> {
    return this.redis.hget(key, field);
  }

  /**
   * Lấy giá trị của nhiều trường trong hash
   * @param key - Khóa của hash
   * @param fields - Danh sách tên trường
   * @returns Mảng các giá trị tương ứng
   */
  async hMGet(key: string, ...fields: string[]): Promise<(string | null)[]> {
    return this.redis.hmget(key, ...fields);
  }

  /**
   * Lấy tất cả các trường và giá trị trong hash
   * @param key - Khóa của hash
   * @returns Object chứa các cặp trường/giá trị
   */
  async hGetAll(key: string): Promise<Record<string, string>> {
    return this.redis.hgetall(key);
  }

  /**
   * Xóa một hoặc nhiều trường khỏi hash
   * @param key - Khóa của hash
   * @param fields - Danh sách tên trường cần xóa
   * @returns Số lượng trường đã xóa
   */
  async hDel(key: string, ...fields: string[]): Promise<number> {
    return this.redis.hdel(key, ...fields);
  }

  /**
   * Kiểm tra xem trường có tồn tại trong hash không
   * @param key - Khóa của hash
   * @param field - Tên trường
   * @returns 1 nếu trường tồn tại, 0 nếu không
   */
  async hExists(key: string, field: string): Promise<number> {
    return this.redis.hexists(key, field);
  }

  // ------ CÁC PHƯƠNG THỨC LÀM VIỆC VỚI LIST ------

  /**
   * Thêm một hoặc nhiều giá trị vào đầu list
   * @param key - Khóa của list
   * @param values - Các giá trị cần thêm
   * @returns Độ dài của list sau khi thêm
   */
  async lPush(key: string, ...values: string[]): Promise<number> {
    return this.redis.lpush(key, ...values);
  }

  /**
   * Thêm một hoặc nhiều giá trị vào cuối list
   * @param key - Khóa của list
   * @param values - Các giá trị cần thêm
   * @returns Độ dài của list sau khi thêm
   */
  async rPush(key: string, ...values: string[]): Promise<number> {
    return this.redis.rpush(key, ...values);
  }

  /**
   * Lấy và xóa phần tử đầu tiên của list
   * @param key - Khóa của list
   * @returns Phần tử đầu tiên, hoặc null nếu list rỗng
   */
  async lPop(key: string): Promise<string | null> {
    return this.redis.lpop(key);
  }

  /**
   * Lấy và xóa phần tử cuối cùng của list
   * @param key - Khóa của list
   * @returns Phần tử cuối cùng, hoặc null nếu list rỗng
   */
  async rPop(key: string): Promise<string | null> {
    return this.redis.rpop(key);
  }

  /**
   * Lấy phần tử của list theo vị trí
   * @param key - Khóa của list
   * @param index - Vị trí của phần tử (0 là đầu tiên, -1 là cuối cùng)
   * @returns Phần tử tại vị trí đó, hoặc null nếu vị trí không hợp lệ
   */
  async lIndex(key: string, index: number): Promise<string | null> {
    return this.redis.lindex(key, index);
  }

  /**
   * Lấy danh sách các phần tử trong một phạm vi của list
   * @param key - Khóa của list
   * @param start - Vị trí bắt đầu
   * @param stop - Vị trí kết thúc
   * @returns Mảng các phần tử trong phạm vi
   */
  async lRange(key: string, start: number, stop: number): Promise<string[]> {
    return this.redis.lrange(key, start, stop);
  }

  /**
   * Lấy độ dài của list
   * @param key - Khóa của list
   * @returns Độ dài của list
   */
  async lLen(key: string): Promise<number> {
    return this.redis.llen(key);
  }

  // ------ CÁC PHƯƠNG THỨC LÀM VIỆC VỚI SET ------

  /**
   * Thêm một hoặc nhiều thành viên vào set
   * @param key - Khóa của set
   * @param members - Các thành viên cần thêm
   * @returns Số lượng thành viên mới được thêm vào (không tính các thành viên đã tồn tại)
   */
  async sAdd(key: string, ...members: string[]): Promise<number> {
    return this.redis.sadd(key, ...members);
  }

  /**
   * Xóa một hoặc nhiều thành viên khỏi set
   * @param key - Khóa của set
   * @param members - Các thành viên cần xóa
   * @returns Số lượng thành viên đã được xóa
   */
  async sRem(key: string, ...members: string[]): Promise<number> {
    return this.redis.srem(key, ...members);
  }

  /**
   * Lấy tất cả các thành viên của set
   * @param key - Khóa của set
   * @returns Mảng các thành viên
   */
  async sMembers(key: string): Promise<string[]> {
    return this.redis.smembers(key);
  }

  /**
   * Kiểm tra xem một thành viên có tồn tại trong set không
   * @param key - Khóa của set
   * @param member - Thành viên cần kiểm tra
   * @returns 1 nếu thành viên tồn tại, 0 nếu không
   */
  async sIsMember(key: string, member: string): Promise<number> {
    return this.redis.sismember(key, member);
  }

  /**

/**
   * Lấy số lượng thành viên trong set
   * @param key - Khóa của set
   * @returns Số lượng thành viên
   */
  async sCard(key: string): Promise<number> {
    return this.redis.scard(key);
  }

  /**
   * Tìm phần giao của hai hoặc nhiều set
   * @param keys - Các khóa của các set
   * @returns Mảng các phần tử chung giữa các set
   */
  async sInter(...keys: string[]): Promise<string[]> {
    return this.redis.sinter(...keys);
  }

  /**
   * Tìm phần hợp của hai hoặc nhiều set
   * @param keys - Các khóa của các set
   * @returns Mảng các phần tử có trong ít nhất một set
   */
  async sUnion(...keys: string[]): Promise<string[]> {
    return this.redis.sunion(...keys);
  }

  /**
   * Tìm phần hiệu của hai set (phần tử có trong set thứ nhất nhưng không có trong set thứ hai)
   * @param key1 - Khóa của set thứ nhất
   * @param key2 - Khóa của set thứ hai
   * @returns Mảng các phần tử thuộc phần hiệu
   */
  async sDiff(key1: string, key2: string): Promise<string[]> {
    return this.redis.sdiff(key1, key2);
  }

  // ------ CÁC PHƯƠNG THỨC LÀM VIỆC VỚI SORTED SET ------

  /**
   * Thêm một hoặc nhiều thành viên vào sorted set với điểm số
   * @param key - Khóa của sorted set
   * @param scoreMembers - Mảng các cặp [score, member]
   * @returns Số lượng thành viên mới được thêm vào
   */
  async zAdd(
    key: string,
    ...scoreMembers: (string | number)[]
  ): Promise<number> {
    return this.redis.zadd(key, ...scoreMembers);
  }

  /**
   * Lấy điểm số của một thành viên trong sorted set
   * @param key - Khóa của sorted set
   * @param member - Thành viên cần lấy điểm số
   * @returns Điểm số của thành viên, hoặc null nếu thành viên không tồn tại
   */
  async zScore(key: string, member: string): Promise<string | null> {
    return this.redis.zscore(key, member);
  }

  /**
   * Lấy danh sách các thành viên trong sorted set theo phạm vi điểm số
   * @param key - Khóa của sorted set
   * @param min - Điểm số nhỏ nhất
   * @param max - Điểm số lớn nhất
   * @returns Mảng các thành viên trong phạm vi điểm số
   */
  async zRangeByScore(
    key: string,
    min: number | string,
    max: number | string,
  ): Promise<string[]> {
    return this.redis.zrangebyscore(key, min, max);
  }

  /**
   * Lấy danh sách các thành viên trong sorted set theo phạm vi thứ hạng
   * @param key - Khóa của sorted set
   * @param start - Thứ hạng bắt đầu (0 là thành viên có điểm số thấp nhất)
   * @param stop - Thứ hạng kết thúc
   * @returns Mảng các thành viên trong phạm vi thứ hạng
   */
  async zRange(key: string, start: number, stop: number): Promise<string[]> {
    return this.redis.zrange(key, start, stop);
  }

  /**
   * Xóa một hoặc nhiều thành viên khỏi sorted set
   * @param key - Khóa của sorted set
   * @param members - Các thành viên cần xóa
   * @returns Số lượng thành viên đã xóa
   */
  async zRem(key: string, ...members: string[]): Promise<number> {
    return this.redis.zrem(key, ...members);
  }

  /**
   * Lấy số lượng thành viên trong sorted set
   * @param key - Khóa của sorted set
   * @returns Số lượng thành viên
   */
  async zCard(key: string): Promise<number> {
    return this.redis.zcard(key);
  }

  /**
   * Tăng điểm số của một thành viên trong sorted set
   * @param key - Khóa của sorted set
   * @param increment - Số điểm cần tăng
   * @param member - Thành viên cần tăng điểm
   * @returns Điểm số mới của thành viên
   */
  async zIncrBy(
    key: string,
    increment: number,
    member: string,
  ): Promise<string> {
    return this.redis.zincrby(key, increment, member);
  }

  // ------ CÁC PHƯƠNG THỨC KHÁC ------

  /**
   * Lấy thời gian sống còn lại của khóa (tính bằng giây)
   * @param key - Khóa cần kiểm tra
   * @returns Thời gian sống còn lại (giây), -1 nếu khóa không có thời gian sống, -2 nếu khóa không tồn tại
   */
  async ttl(key: string): Promise<number> {
    return this.redis.ttl(key);
  }

  /**
   * Tìm kiếm các khóa phù hợp với mẫu
   * @param pattern - Mẫu tìm kiếm (VD: user:*, user:???)
   * @returns Mảng các khóa phù hợp
   */
  async keys(pattern: string): Promise<string[]> {
    return this.redis.keys(pattern);
  }

  /**
   * Đăng ký một callback để xử lý tin nhắn từ kênh
   * @param channel - Tên kênh
   * @param callback - Hàm xử lý tin nhắn
   */
  async subscribe(
    channel: string,
    callback: (channel: string, message: string) => void,
  ): Promise<void> {
    await this.redis.subscribe(channel);
    this.redis.on('message', callback);
  }

  /**
   * Gửi tin nhắn đến một kênh
   * @param channel - Tên kênh
   * @param message - Nội dung tin nhắn
   * @returns Số lượng client đã nhận tin nhắn
   */
  async publish(channel: string, message: string): Promise<number> {
    return this.redis.publish(channel, message);
  }

  /**
   * Hủy đăng ký khỏi một kênh
   * @param channel - Tên kênh
   */
  async unsubscribe(channel: string): Promise<void> {
    await this.redis.unsubscribe(channel);
  }

  /**
   * Lấy client Redis gốc để thực hiện các thao tác nâng cao
   * @returns Client Redis gốc
   */
  getClient(): Redis {
    return this.redis;
  }
}
