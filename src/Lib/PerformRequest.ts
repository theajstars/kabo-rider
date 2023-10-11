import { useEffect, useState } from "react";

import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { Endpoints } from "./Endpoints";

interface RequestOptions {
  method: "POST" | "GET" | "PUT";
  data: any;
  route: string;
}
const baseURL = "https://api.kabo.delivery";
const PerformRequest = async ({ method, data, route }: RequestOptions) => {
  const config = {
    method,
    data,
    url: `${baseURL}${route}`,
  };
  const r: any = axios.request(config);
  return r;
};

const UploadFile = async (file: File) => {
  const token = Cookies.get("token");

  const fileFormData = new FormData();
  fileFormData.append("token", token ?? "");
  fileFormData.append(
    "file",
    file,
    file.name.toLowerCase().split(" ").join().replaceAll(",", "")
  );
  const config: AxiosRequestConfig = {
    method: "POST",
    url: `${baseURL}${Endpoints.UploadFile}`,

    data: fileFormData,
    maxBodyLength: Infinity,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  const response = await axios.request(config);

  return response as any;
};

interface usePerformRequestOptions {
  method: "POST" | "GET" | "PUT";
  url: string;
  body?: any;
}
function usePerformRequest<Type>({
  method,
  url,
  body,
}: usePerformRequestOptions) {
  const [data, setData] = useState<Type>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const reloadData = async () => {
    const config: AxiosRequestConfig = {
      method,
      data: body,
      url,
    };
    setLoading(true);
    const r = await axios(config);
    setLoading(false);
    if (r.data) {
      setData(r.data);
    }
  };
  useEffect(() => {
    reloadData().catch(() => setLoading(false));
  }, [url]);

  return { data, isLoading, reloadData };
}
export { PerformRequest, UploadFile, usePerformRequest };
