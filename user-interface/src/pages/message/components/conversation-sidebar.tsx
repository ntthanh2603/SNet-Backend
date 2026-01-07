import { CircleButton } from '@components/button';
import { AddIcon } from '@components/icons';
import ToggleGroup from '@components/toggle-group/toggle-group';
import ConversationItem from './conversation-item';
import { _conversation as fakeConversation } from '@_mocks/_conversation';
import { SearchBar } from '@components/search';

//----------------------------------------------------------------------
interface ConversationSidebarProps {
  onConversationClick: (id: any) => void;
}

export default function ConversationSidebar({
  onConversationClick,
}: ConversationSidebarProps) {
  return (
    <section className="relative w-full min-h-screen lg:min-h-full bg-surface-2 flex flex-col gap-3 p-3 lg:max-w-[20rem] lg:min-w-[20rem] xl:max-w-[25rem] xl:min-w-[25rem]">
      <div className="w-full flex justify-start items-center gap-2">
        <SearchBar className="flex grow" />

        <CircleButton className="p-2.5" children={<AddIcon />} />
      </div>

      <ToggleGroup
        items={[
          { key: '1', label: 'For you' },
          { key: '2', label: 'Following' },
        ]}
      />

      <div className="w-full max-h-full flex flex-col gap-2 overflow-y-auto">
        {fakeConversation.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            isReaded={false}
            isUserOnlined={true}
            conversation={conversation}
            onClick={() => onConversationClick(conversation.id)}
          />
        ))}
      </div>
    </section>
  );
}
