import { lazy } from "react";
import Home from "../views/Home";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      title: "知乎日报-WebApp",
    },
  },
  {
    path: "/detail/:id",
    name: "detail",
    component: lazy(() => import("../views/Detail")),
    meta: {
      title: "知乎日报-详情",
    },
  },
  {
    path: "/personal",
    name: "personal",
    component: lazy(() => import("../views/Personal")),
    meta: {
      title: "知乎日报-个人中心",
    },
  },
  {
    path: "/store",
    name: "store",
    component: lazy(() => import("../views/Store")),
    meta: {
      title: "知乎日报-收藏",
    },
  },
  {
    path: "/login",
    name: "login",
    component: lazy(() => import("../views/Login")),
    meta: {
      title: "知乎日报-登录/注册",
    },
  },
  {
    path: "/update",
    name: "update",
    component: lazy(() => import("../views/Update")),
    meta: {
      title: "知乎日报-ffabu",
    },
  },
  {
    path: "*",
    name: "404",
    component: lazy(() => import("../views/Page404")),
    meta: {
      title: "知乎日报-404",
    },
  },
];

export default routes;
