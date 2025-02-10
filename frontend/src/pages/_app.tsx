import "../styles/globals.css";
import type { AppProps } from "next/app";

// import "antd/dist/reset.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="bg-gray-100">
      <Component {...pageProps} />
    </div>
  );
}
