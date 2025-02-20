import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  home() {
    return 'Đây là trang chủ';
  }

  async chatbot(prompt: string) {
    const genAI = new GoogleGenerativeAI(
      this.configService.get('GEMINI_API_KEY'),
    );
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: 'text/plain',
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const promptBase = `Trong dự án ứng dụng mạng xã hội tên SNet, SNet có các chức 
    năng tạo đoạn chat,nhắn tin, theo dõi người dùng khác, hủy theo dõi người dùng
    khác, thông báo, đăng bài, thả cảm xúc, bình luận. Bạn hãy trả lời câu hỏi sau:`;

    const result = await chatSession.sendMessage(promptBase + prompt);

    return { result: result.response.text() };
  }
}
