import { GenderType } from "@/lib/enum";
import instance from "./axios.customize";
import { AxiosResponse } from "axios";

interface APIResponse {
  data: object;
  statusCode: number;
  message: string;
  error: string;
}

export const registerUser = async (formData: {
  email: string;
  password: string;
  username: string;
  bio: string;
  website: string;
  age: number;
  gender: GenderType;
  address: string;
}) => {
  try {
    const response: AxiosResponse<APIResponse> =
      await instance.post<APIResponse>("/auth/register", formData);
    console.log(response);

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Đăng ký thất bại");
  }
};
