import { CircleButton } from '@components/button';
import { AddIcon, BrowserIcon, FolderIcon, GlobeIcon } from '@components/icons';
import FolderItem from './folder-item';
import { _posts as fakePosts } from '@_mocks/_posts';
import { _media as fakeMedia } from '@_mocks/_media';
import { SearchBar } from '@components/search';

//----------------------------------------------------------------------

const folders = [
  { id: '1', name: 'FrontEnd', icon: <FolderIcon /> },
  { id: '2', name: 'Development', icon: <GlobeIcon /> },
  { id: '3', name: 'UI-UX', icon: <BrowserIcon /> },
  { id: '4', name: 'BackEnd', icon: <FolderIcon /> },
];

interface BookmarkFolderProps {
  onConversationClick: (id: any) => void;
}

export default function BookmarkFolder({
  onConversationClick,
}: BookmarkFolderProps) {
  const folderWithCounts = folders.map((folder) => {
    const postCount = fakePosts.filter(
      (post) => post.cateId === folder.id,
    ).length;
    const mediaCount = fakeMedia.filter(
      (media) => media.cateId === folder.id,
    ).length;
    return {
      ...folder,
      postCount,
      mediaCount,
    };
  });

  return (
    <div className="relative w-full min-h-screen lg:min-h-screen bg-surface-2 flex flex-col gap-3 p-3 lg:max-w-[20rem] lg:min-w-[20rem] xl:max-w-[25rem] xl:min-w-[25rem]">
      <div className="w-full flex justify-start items-center gap-2">
        <SearchBar className="flex grow" />

        <CircleButton className="p-2.5" children={<AddIcon />} />
      </div>
      <div className="w-full max-h-screen flex flex-col gap-2 overflow-y-auto">
        {folderWithCounts.map((folder) => (
          <FolderItem
            key={folder.id}
            icon={folder.icon}
            folderName={folder.name}
            numberOfFiles={folder.postCount + folder.mediaCount}
            onClick={() => onConversationClick(folder.id)}
          />
        ))}
      </div>
    </div>
  );
}
