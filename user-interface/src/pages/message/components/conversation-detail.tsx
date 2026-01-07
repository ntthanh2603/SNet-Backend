import Avatar from '@components/avatar/avatar';
import { CircleButton } from '@components/button';
import { ClodeIcon, MoreIcon } from '@components/icons';
import { Typography } from '@components/typography';
import MessageItem from './message-item';
import ChatInput from './chat-input';
import { useNavigate, useParams } from 'react-router-dom';

//----------------------------------------------------------------------

const messages = [
  {
    user: {
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
      name: 'Apple hi',
    },
    content: 'Hello, how can I help you today?',
    time: '8:30 AM',
    imageUrl: 'https://i.pravatar.cc/600?img=2',
  },
  {
    user: {
      avatarUrl: 'https://i.pravatar.cc/150?img=2',
      name: 'Samsung',
    },
    content: 'Hello, how can I help you today?',
    time: '8:30 AM',
  },
  {
    user: {
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
      name: 'Apple Releases',
    },
    content: 'Hello, can I help you?',
    time: '8:30 AM',
  },
];

const _conversations = [
  {
    id: 1,
    user: {
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
      name: 'John Doe',
    },
    content: 'Test content',
    messages: messages,
  },
  {
    id: 2,
    user: {
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
      name: 'John Doe 2',
    },
    content: 'Test content 2',
  },
];

export default function ConversationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const conversation = _conversations.find((item) => item.id === Number(id));
  console.log('conversation', conversation);

  if (!conversation) return null;

  const handleBack = () => {
    navigate('/messages');
  };

  return (
    <section className="block md:hidden w-full h-full flex-col bg-surface lg:flex">
      <section
        id="conversation-header"
        className="w-full flex items-center gap-4 py-3 pr-6 pl-3"
      >
        <Avatar
          src="https://i.pravatar.cc/150?img=1"
          alt="avatar"
          isOnline={true}
        />

        <Typography level="base2m" className="text-primary grow">
          {conversation.user.name}
        </Typography>

        <CircleButton className="p-2.5" children={<MoreIcon />} />

        <CircleButton
          onClick={handleBack}
          className="p-2.5 lg:hidden"
          children={<ClodeIcon />}
        />
      </section>

      <section
        id="chat-container"
        className="flex flex-col gap-2 h-[calc(100vh-150px)] overflow-y-auto items-center justify-start p-3"
      >
        {conversation.messages?.map((message, index) => (
          <MessageItem key={index} message={message} />
        ))}
      </section>

      <ChatInput />
    </section>
  );
}
