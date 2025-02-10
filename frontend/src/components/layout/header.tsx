import {
  AppstoreOutlined,
  BellOutlined,
  BookOutlined,
  CommentOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FieldTimeOutlined,
  // GithubOutlined,
  HistoryOutlined,
  HomeOutlined,
  MoonOutlined,
  QuestionCircleOutlined,
  SafetyOutlined,
  SettingOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserAddOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Menu, Input, Avatar } from "antd";
import "../../styles/header.module.css";
import type { GetProps } from "antd";
import Link from "next/link";

const Header = () => {
  type SearchProps = GetProps<typeof Input.Search>;

  const { Search } = Input;

  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);

  const mainMenuItems = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: <Link href="/">Trang chủ</Link>,
    },
    {
      key: "groups",
      icon: <EditOutlined />,
      label: <Link href="/groups">Thêm bài</Link>,
    },
    {
      key: "follows",
      icon: <UserAddOutlined />,
      label: <Link href="/follows">Theo dõi</Link>,
    },
    {
      key: "friends",
      icon: <TeamOutlined />,
      label: <Link href="/friend">Bạn bè</Link>,
    },
  ];

  const userMenuItems = [
    {
      key: "menu",
      icon: <AppstoreOutlined />,
      label: "Menu",
      children: [
        {
          key: "home",
          icon: <HomeOutlined />,
          label: <Link href="/groups">Thêm bài</Link>,
        },
        {
          key: "groups",
          icon: <EditOutlined />,
          label: <a href="/groups">Thêm bài</a>,
        },
        {
          key: "follows",
          icon: <UserAddOutlined />,
          label: <Link href="/follows">Theo dõi</Link>,
        },
        {
          key: "friends",
          icon: <TeamOutlined />,
          label: <Link href="/friend">Bạn bè</Link>,
        },
        {
          key: "list-friends",
          icon: <SolutionOutlined />,
          label: <Link href="/settings">Danh sách bạn bè</Link>,
        },
        {
          key: "activates",
          icon: <HistoryOutlined />,
          label: <Link href="/recent">Hoạt động gần đây</Link>,
        },
        {
          key: "posts-saved",
          icon: <BookOutlined />,
          label: <Link href="/saved">Bài viết đã lưu</Link>,
        },
        {
          key: "memories",
          icon: <FieldTimeOutlined />,
          label: <Link href="/memories">Kỉ niệm</Link>,
        },
      ],
    },
    {
      key: "messages",
      icon: <CommentOutlined />,
      label: <Link href="/chatRooms">Tin nhắn</Link>,
    },
    {
      key: "notifications",
      icon: <BellOutlined />,
      label: <Link href="/notifications">Thông báo</Link>,
    },
    {
      key: "other",
      icon: (
        <Avatar
          style={{
            verticalAlign: "middle",
          }}
          size={32}
        >
          {"T"}
        </Avatar>
      ),
      label: "Thêm",
      children: [
        {
          key: "settings",
          icon: <SettingOutlined />,
          label: <Link href="/settings">Cài đặt</Link>,
        },
        {
          key: "privacy",
          icon: <SafetyOutlined />,
          label: <Link href="/privacy">Quyền riêng tư</Link>,
        },
        {
          key: "suport",
          icon: <QuestionCircleOutlined />,
          label: <Link href="/help">Trợ giúp và hỗ trợ</Link>,
        },
        {
          key: "screen",
          icon: <MoonOutlined />,
          label: <Link href="/display">Màn hình và trợ năng</Link>,
        },
        {
          key: "contribute-ideas",
          icon: <ExclamationCircleOutlined />,
          label: <Link href="/feedback">Đóng góp ý kiến</Link>,
        },
        {
          key: "logout",
          icon: <UserSwitchOutlined />,
          label: <Link href="/logout">Đăng xuất</Link>,
        },
      ],
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        zIndex: 1000,
        boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.2)",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
      className="bg-sky-600 header"
    >
      <div style={{ display: "flex", width: "25%" }}>
        <Link
          href="/profile"
          className="flex items-center gap-2 self-center font-medium text-white text-2xl mr-5 ml-5"
        >
          SNet
        </Link>
        <Search
          placeholder="Tìm kiếm trên SNet"
          allowClear
          onSearch={onSearch}
          style={{
            width: "70%",
          }}
        />
      </div>

      <Menu
        mode="horizontal"
        items={mainMenuItems}
        className="menu-bar bg-sky-600"
      />

      <Menu
        mode="horizontal"
        items={userMenuItems}
        className="menu-bar bg-sky-600"
      />
    </div>
  );
};

export default Header;
