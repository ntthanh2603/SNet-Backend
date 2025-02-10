"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-sky-50">
        <CardHeader className="text-center">
          <a
            href="#"
            className="flex items-center gap-2 self-center font-medium text-sky-400 text-2xl "
          >
            SNet
          </a>
          <CardTitle className="text-xl">Chào mừng bạn trở lại</CardTitle>
          <CardDescription>
            Đăng nhập với tài khoản Apple hoặc Google
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full bg-sky-100">
                  Đăng nhập với tài khoản Apple
                </Button>
                <Button variant="outline" className="w-full bg-sky-100">
                  Đăng nhập với tài khoản Google
                </Button>
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Hoặc tiếp tục với
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Nhập email của bạn"
                    required
                    className="bg-sky-100"
                  />
                </div>
                <div className="grid gap-2 relative">
                  <div className="flex items-center">
                    <Label htmlFor="password">Mật khẩu</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Nhập mật khẩu của bạn"
                      className="bg-sky-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <Link
                    href="/auth/forgerpassword"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <Button type="submit" className="w-full bg-sky-300">
                  Đăng nhập
                </Button>
              </div>
              <div className="text-center text-sm">
                Bạn chưa có tài khoản ?{" "}
                <a href="register" className="underline underline-offset-4">
                  Đăng kí
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        Bằng cách nhấn đăng nhập, bạn đồng ý với chúng tôi{" "}
        <Link href="#">Điều khoản dịch vụ</Link> và{" "}
        <Link href="#">Chính sách bảo mật</Link>
      </div>
    </div>
  );
}
