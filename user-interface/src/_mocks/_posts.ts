import { Post } from '@interfaces/post';

//-------------------------------------------------------------------------------------------------------------------------

export const _posts: Post[] = [
  {
    id: 1,
    user: {
      name: '200Lab',
      avatar: 'https://picsum.photos/800/800',
      time: '2h ago',
    },
    content: {
      text: `Full bộ source code: Simple Task Microservices từ 200Lab <a href="https://devops.showcase.200lab.io/">#200labshowcase</a>`,
      image:
        'https://i.pinimg.com/736x/47/b5/2f/47b52fcaef898aca6c54c7af46e0d0b8.jpg',
    },
    interactions: {
      likes: 72,
      reposts: 22,
      comments: 33,
    },
    comments: [
      {
        id: 1,
        user: {
          name: '200Lab',
          avatar: 'https://picsum.photos/800/800',
        },
        content: {
          text: `Hay quá haha!`,
          image:
            'https://i.pinimg.com/736x/a7/cb/e3/a7cbe32b3ffd571150196e93df70c24f.jpg',
        },
        interactions: {
          likes: 11,
          reposts: 12,
          comments: 23,
        },
      },
      {
        id: 2,
        user: {
          name: 'Vy Tran',
          avatar: 'https://picsum.photos/800/800',
        },
        content: {
          text: `Hihi`,
          image: '',
        },
        interactions: {
          likes: 11,
          reposts: 12,
          comments: 23,
        },
      },
    ],
    cateId: '1',
  },
  {
    id: 2,
    user: {
      name: 'Viet Tran',
      avatar:
        'https://i.pinimg.com/originals/d3/6f/ef/d36fef4f4885354afcfd3753dee95741.jpg',
      time: '5h ago',
    },
    content: {
      text: `Spent the weekend diving deep into Docker 🐳. It's amazing how containerization can streamline the CI/CD process. Can't wait to use this in my next project! #Docker #DevOps #CICD`,
      image:
        'https://i.pinimg.com/736x/a2/e9/3f/a2e93ff39f2f1c922d549ec745485647.jpg',
    },
    interactions: {
      likes: 89,
      reposts: 30,
      comments: 41,
    },
    comments: [
      {
        id: 1,
        user: {
          name: 'Thanh Nguyen',
          avatar: 'https://picsum.photos/800/800',
        },
        content: {
          text: `Nice!`,
          image: '',
        },
        interactions: {
          likes: 11,
          reposts: 12,
          comments: 23,
        },
      },
      {
        id: 2,
        user: {
          name: 'Tien Luu',
          avatar: 'https://picsum.photos/800/800',
        },
        content: {
          text: `Great!`,
          image:
            'https://i.pinimg.com/564x/47/30/1c/47301cb653f3139c3b69e7da0353cf86.jpg',
        },
        interactions: {
          likes: 11,
          reposts: 12,
          comments: 23,
        },
      },
    ],
    cateId: '2',
  },
  {
    id: 3,
    user: {
      name: 'Nga Vu',
      avatar:
        'https://i.pinimg.com/736x/72/24/79/7224792f4a48a6a362d2d56763c178d7.jpg',
      time: '10h ago',
    },
    content: {
      text: `I'm thrilled to announce that I'll be speaking at the upcoming JavaScript Summit! 🎤 Get ready for some exciting insights into the future of web development. #JavaScript #TechTalk`,
      image:
        'https://i.pinimg.com/564x/ec/c9/c1/ecc9c1a86c8c57b6ace4102f9f19d567.jpg',
    },
    interactions: {
      likes: 45,
      reposts: 15,
      comments: 25,
    },
    comments: [
      {
        id: 1,
        user: {
          name: 'Viet Tran',
          avatar: 'https://picsum.photos/800/800',
        },
        content: {
          text: `Awesome!`,
          image:
            'https://i.pinimg.com/564x/0b/a5/cd/0ba5cd35386c4b71129e66d247468542.jpg',
        },
        interactions: {
          likes: 11,
          reposts: 12,
          comments: 23,
        },
      },
    ],
    cateId: '1',
  },
];
