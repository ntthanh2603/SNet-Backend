import { CircleButton } from '@components/button';
import { ArrowBackIcon, ExplandIcon } from '@components/icons';
import { useNavigate } from 'react-router-dom';

//----------------------------------------------------------------------------
type Props = {
  children: React.ReactNode;
};

export default function SubHeader({ children }: Props) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <section className="w-full min-h-screen bg-surface p-3 pb-[5rem] md:pb-0 transition-all duration-[0.5s]">
      <section className="mb-3 flex justify-between items-center">
        <CircleButton
          children={<ArrowBackIcon />}
          disabled={false}
          onClick={() => handleBack()}
          className="cursor-pointer md:bg-button rounded-full p-[0.625rem]"
        />

        <CircleButton
          children={<ExplandIcon />}
          disabled={false}
          className="cursor-pointer md:bg-button rounded-full p-[0.625rem]"
        />
      </section>
      <section className="w-full flex flex-col gap-2 items-center">
        {children}
      </section>
    </section>
  );
}
