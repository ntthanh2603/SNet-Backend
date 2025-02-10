import React from "react";
import { Result, Button } from "antd";
import Link from "next/link";

const PageNotFound = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi trang này không tồn tại hoặc đã bị xóa !"
      extra={
        <Button type="primary">
          <Link href="/">Trở lại trang chủ</Link>
        </Button>
      }
    />
  );
};

export default PageNotFound;
