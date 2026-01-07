import { CircleButton } from '@components/button';
import { ArrowBackIcon, CameraIcon, MoreIcon } from '@components/icons';
import { Typography } from '@components/typography';
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
        className="p-2"
        children={<ArrowBackIcon />}
        onClick={handleBack}
      />

      <span className="grow" />

      <CircleButton className="p-2" children={<MoreIcon />} />

      <CircleButton className="p-2" children={<CameraIcon />} />

      <CircleButton
        children={
          <Typography level="base2sm" className="text-secondary">
            Save
          </Typography>
        }
        className="px-5 py-2"
      />
    </section>
  );
}
