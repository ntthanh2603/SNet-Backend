# SNet - Modern Social Network Platform

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
</p>

## 🚀 Overview

SNet is a powerful social networking platform built on modern technologies. The project leverages NestJS as its primary framework for building a scalable and efficient backend, with FastAPI serving as a secondary framework for AI-powered features and API processing.

## 🔧 Tech Stack

### Core Technologies

- **[NestJS](https://nestjs.com/)**: Primary backend framework
- **[FastAPI](https://fastapi.tiangolo.com/)**: Secondary framework for AI models and API processing
- **[PostgreSQL](https://www.postgresql.org/)**: Main database
- **[Redis](https://redis.io/)**: In-memory database for caching and real-time features
- **[BullMQ](https://docs.bullmq.io/)**: Queue system for background job processing
- **[Elasticsearch](https://www.elastic.co/)**: Search engine for content indexing
- **[FAISS](https://github.com/facebookresearch/faiss)**: Vector similarity search for AI features

## 🗂️ Project Structure

```
├── src/                    # Backend system
├── model-ai/               # Models AI use FastAPI, Huggingface, Faiss...
├── docs/                   # Documents for project and images for README.md
├── public/                 # Data images/videos of app
├── test/                   # Files test app
├── docker-compose.yaml     # Manager containers
├── README.md               # Project documentation (this file)
└── .gitignore              # Block files when push github
```

#### Model detect image 16+ [**click here**](https://github.com/ntthanh2603/ImageGuard.git)

#### Model AI segmentation analysis [**click here**](https://github.com/ntthanh2603/segmentation-analysis.git)

#### Database [**click here**](https://drive.google.com/file/d/1ZPQa1NhCKHPOJKAGEMPWNWbutVYLUWsU/view?usp=sharing)

## ⚙️ Installation and Setup

### Using Docker (Recommended)

```bash
# Create and run all services
docker-compose up

# To shut down and remove volumes
docker-compose down -v
```

### Manual Setup

```bash
# Install dependencies
npm install --legacy-peer-deps

# Development mode with hot-reload
npm run dev
```

## 🔄 Architecture

SNet follows a microservices architecture:

1. **NestJS Backend**: Handles core application logic, authentication, and main API endpoints
2. **FastAPI Services**: Process AI-related tasks and specialized API endpoints
3. **Database Layer**: PostgreSQL for persistent storage, Redis for caching
4. **Search Services**: Elasticsearch for content search, FAISS for AI vector similarity search
5. **Background Processing**: BullMQ for handling asynchronous tasks


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💬 Support

If you encounter any issues or need support, please reach out:

- [Facebook](https://www.facebook.com/ntthanh2603)

## 📜 License

SNet is [MIT licensed](LICENSE).

<p align="center">
  <img src="docs/images/thanks-for-watching.jpg" alt="Thanks for watching" width="400" />
</p>
