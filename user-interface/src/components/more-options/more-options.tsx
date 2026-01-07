import { HideIcon, LinkIcon, LockIcon } from '@components/icons';
import MoreItem from './more-item';

//--------------------------------------------------------------------------------------------------------

const _moreOptions = [
  {
    title: 'Edit',
    icon: <LockIcon />,
  },
  {
    title: 'Link',
    icon: <LinkIcon />,
  },
  {
    title: 'Hide',
    icon: <HideIcon />,
  },
];

export default function MoreOptions() {
  return (
    <div className="absolute flex-col w-[15rem] p-2 bg-neutral3-70 shadow-dropup backdrop-blur-[32px] rounded-[1.5rem] top-[3rem] right-1">
      {_moreOptions.map((item) => (
        <MoreItem key={item.title} title={item.title} icon={item.icon} />
      ))}
    </div>
  );
}
