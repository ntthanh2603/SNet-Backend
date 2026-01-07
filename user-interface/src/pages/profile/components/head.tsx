import { CircleButton } from '@components/button';
import { ArrowBackIcon, MoreIcon } from '@components/icons';
import { useNavigate } from 'react-router-dom';

//-------------------------------------------------------------------------

export default function Head() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <section className="w-full absolute flex justify-between items-center gap-2 p-3 z-10">
      <CircleButton
        onClick={handleBack}
        className="p-2"
        children={<ArrowBackIcon />}
      />

      <CircleButton className="p-2" children={<MoreIcon />} />
    </section>
  );
}
