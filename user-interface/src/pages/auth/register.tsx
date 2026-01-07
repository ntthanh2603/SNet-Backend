import { AvatarGroup } from '@components/avatar';
import { Button, CircleButton } from '@components/button';
import { Typography } from '@components/typography';
import style from '@styles/auth.module.css';
import React from 'react';
import { Input } from './components';
import { useUsersControllerAfterSignUp } from '@services/apis/gen/queries';
import { useNavigate } from 'react-router-dom';
import { _avatarData as fakeAvatar } from '@_mocks/_avatar';

//----------------------------------------------------------------------

export default function Register() {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

  const { mutate: register, isPending: loading } =
    useUsersControllerAfterSignUp({
      mutation: {
        onSuccess: () => {
          alert('Đăng ký thành công!');
          navigate('/login');
        },
        onError: (err: any) => {
          setError(err?.response?.data?.message || 'Có lỗi xảy ra');
        },
      },
    });

  const isValidEmail = (email: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !isValidEmail(email) || !password) return;
    register({
      data: {
        username,
        email,
        password,
        address: '',
        bio: '',
        birthday: '',
        gender: 'other',
        website: '',
        avatar: '',
      },
    });
  };

  return (
    <>
      <div className="bg-auth w-full h-svh flex flex-col justify-around items-center px-[2.5rem]">
        <div id="stars" className={style.stars}></div>
        <div className="w-full mx-auto md:mt-0 md:w-[25.5rem] md:max-h-[37.25rem] md:p-[40px] md:bg-neutral1-5 md:rounded-[32px] md:shadow-auth-card md:backdrop-blur-[50px]">
          <div
            className="flex flex-col mb-[10px] items-center gap-6 "
            id="top-bar-container "
          >
            <CircleButton className="size-[60px] p-[18px]">
              <img src="/svg/circle_logo.svg" alt="Bento Logo" />
            </CircleButton>
            <Typography level="h4" className="text-primary">
              Tạo tài khoản SNet
            </Typography>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-[0.875rem] mb-[1.5rem]">
              <Input
                type="text"
                name="fullname"
                placeholder="Họ và tên"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={
                  <object
                    type="image/svg+xml"
                    data="/svg/ic_reset_password.svg"
                    className="absolute right-[8px] top-[8px] cursor-pointer"
                  />
                }
              />
              {/* Removed showOtp section */}
            </div>

            {error && (
              <Typography
                level="captionr"
                className="text-error text-center mb-3"
              >
                {error}
              </Typography>
            )}

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full base px-[2rem] py-[0.875rem] text-secondary text-sm font-semibold opacity-100"
                child={
                  <Typography level="base2sm">
                    {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                  </Typography>
                }
                disabled={loading || !username || !email || !password}
              />
              <Button
                className="w-full px-[2rem] py-[0.875rem]"
                child={
                  <div className="flex items-center gap-3 justify-center">
                    <img
                      src="/svg/ic_google.svg"
                      alt="Google Logo"
                      className="w-[20px] h-[20px]"
                    />
                    <Typography level="base2sm" className="text-secondary ">
                      Đăng nhập với Google
                    </Typography>
                  </div>
                }
              />

              <Typography
                level="captionr"
                className="opacity-80 flex items-center gap-2 text-secondary justify-center"
              >
                Bạn đã có tài khoản?
                <a href="/login" className="opacity-100 font-semibold">
                  <Typography level="captionsm" className="opacity-100">
                    Đăng nhập tại đây!
                  </Typography>
                </a>
              </Typography>
            </div>
          </form>
        </div>
        <div className="hidden md:flex md:flex-col md:gap-[24px] md:justify-center md:items-center">
          <Typography className="text-tertiary opacity-80 ">
            Số người tham gia
            <Typography className="font-bold text-primary mx-1">
              2 triệu
            </Typography>
            người dùng toàn cầu
          </Typography>

          <AvatarGroup
            className="size-[2.625rem] min-w-[2.625rem]"
            avatars={fakeAvatar}
          />
        </div>
      </div>
    </>
  );
}
