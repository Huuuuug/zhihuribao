import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@/index.less";

/** REDUX */
import { Provider } from "react-redux";
import store from "./store";

/** REM */
import "lib-flexible";

/** ANTD-MOBILE */
import { ConfigProvider } from "antd-mobile";
import zhCN from "antd-mobile/es/locales/zh-CN";

(function () {
  const handleMax = function handleMax() {
    let html = document.documentElement,
      root = document.getElementById("root"),
      deviceWidth = html.clientWidth;
    root.style.maxWidth = "750px";
    if (deviceWidth > 750) {
      html.style.fontSize = "75px";
    }
  };
  handleMax();
})();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>
);
