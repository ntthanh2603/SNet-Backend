import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Returns a string indicating the home page message.
   *
   * @returns {string} - The message for the home page.
   */

  /******  8418b6ea-591b-4cd6-b4f7-fd0c61a2c1e2  *******/
  home() {
    return 'Đây là trang chủ';
  }

  /**
   * Generates a response from a generative AI model based on a provided prompt.
   *
   * This function initializes a generative AI model using a specified API key
   * and configuration settings. It starts a chat session with the model,
   * appending a base prompt that describes the features of the SNet social
   * networking application. The model is then prompted with additional user
   * input to generate a contextual response.
   *
   * @param prompt - The user-provided string to be appended to the base prompt
   *                 for generating the AI's response.
   * @returns An object containing the AI-generated response text.
   */

  /******  9d761ba5-64f2-46e3-b78d-44707ad3fa4b  *******/
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
