import React, { useEffect, useState, useMemo } from "react";
import { Badge, Toast } from "antd-mobile";
import {
  LeftOutline,
  MessageOutline,
  LikeOutline,
  StarOutline,
  MoreOutline,
} from "antd-mobile-icons";
import "./Detail.less";
import api from "../api";
import SkeletonAgain from "@/components/SkeletonAgain";
import { flushSync } from "react-dom";
import { connect } from "react-redux";
import action from "../store/action";

const Detail = function Detail(props) {
  const { navigate, params } = props;
  const [info, setInfo] = useState(null),
    [extra, setExtra] = useState(null);
  /** 第一次渲染完毕 i请求数据 */
  useEffect(() => {
    getNewsDetail();
    getNewsExtra();
    // 在组件释放的时候清除样式表
    return () => {
      if (link) document.head.removeChild(link);
    };
  }, []);
  let link;
  /** 处理样式文件 */
  const handleStyle = (info) => {
    const { css: cssArr } = info;
    if (!Array.isArray(cssArr)) return;
    const css = info.css[0];
    if (!css) return;
    link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = css;
    document.head.appendChild(link);
  };
  /** 处理图片 */
  const handleImage = (info) => {
    let imgPlaceHolder = document.querySelector(".img-place-holder");
    if (!imgPlaceHolder) return;
    // 创建大图
    const img = new Image();
    img.src = info.image;
    img.onload = () => {
      imgPlaceHolder?.appendChild(img);
    };
    img.onerror = () => {
      const imgPlaceHolderParent = imgPlaceHolder?.parentNode;
      imgPlaceHolderParent?.parentNode?.removeChild(imgPlaceHolderParent);
    };
  };
  /** 获取新闻详情 和样式文件*/
  const getNewsDetail = async () => {
    try {
      const res = await api.queryNewsInfo(params.id);
      flushSync(() => {
        // 先执行flushSync内部两个函数再执行 后续的图片处理函数
        setInfo(res);
        handleStyle(res);
      });
      // 处理样式 图片
      handleImage(res);
    } catch (error) {}
  };
  /** 获取新闻点赞信息 */
  const getNewsExtra = async () => {
    try {
      const res = await api.queryStoryExtra(params.id);
      setExtra(res);
    } catch (error) {}
  };

  /** ----------- 登录收藏 ------------ */
  let {
    base: { info: userInfo },
    queryUserInfoAsync,
    location,
    store: { list: storeList },
    queryStoreListAsync,
    removeStoreListById,
  } = props;

  useEffect(() => {
    (async () => {
      // 第一次渲染完:如果userInfo不存在,我们派发任务同步登录者信息
      if (!userInfo) {
        let { info } = await queryUserInfoAsync();
        userInfo = info;
      }
      // 如果已经登录 && 没有收藏列表信息:派发任务同步收藏列表
      if (userInfo && !storeList) {
        queryStoreListAsync();
      }
    })();
  }, []);

  // 依赖于收藏列表和路径参数,计算出是否收藏
  const isStore = useMemo(() => {
    if (!storeList) return false;
    return storeList.some((item) => {
      return +item.news.id === +params.id;
    });
  }, [storeList, params]);

  // 点击收藏按钮
  const handleStore = async () => {
    if (!userInfo) {
      // 未登录
      Toast.show({
        icon: "fail",
        content: "请先登录",
      });
      navigate(`/login?to=${location.pathname}`, { replace: true });
      return;
    }
    // 已经登录:收藏或者移除收藏
    console.log(isStore);
    if (isStore) {
      // 移除收藏
      let item = storeList.find((item) => {
        return +item.news.id === +params.id;
      });
      if (!item) return;
      let { code } = await api.storeRemove(item.id);
      if (+code !== 0) {
        Toast.show({
          icon: "fail",
          content: "操作失败",
        });
        return;
      }
      Toast.show({
        icon: "success",
        content: "操作成功",
      });
      removeStoreListById(item.id); //告诉redux中也把这一项移除掉
      return;
    }
    // 收藏
    try {
      let { code } = await api.store(params.id);
      if (+code !== 0) {
        Toast.show({
          icon: "fail",
          content: "收藏失败",
        });
        return;
      }
      Toast.show({
        icon: "success",
        content: "收藏成功",
      });
      queryStoreListAsync(); //同步最新的收藏列表到redux容器中
    } catch (_) {}
  };
  return (
    <div className="detail-wrapper">
      {/* 新闻内容 */}
      {!info ? (
        <SkeletonAgain />
      ) : (
        <div
          className="content"
          dangerouslySetInnerHTML={{
            __html: info.body,
          }}
        ></div>
      )}

      {/* 底部图标区域 */}
      <div className="tab-bar">
        <div
          className="back"
          onClick={() => {
            navigate(-1);
          }}
        >
          <LeftOutline />
        </div>
        <div className="icons">
          <Badge content={extra ? extra.comments : 0}>
            <MessageOutline />
          </Badge>
          <Badge content={extra ? extra.popularity : 0}>
            <LikeOutline />
          </Badge>
          <span className={isStore ? "stored" : ""} onClick={handleStore}>
            <StarOutline />
          </span>
          <span>
            <MoreOutline />
          </span>
        </div>
      </div>
    </div>
  );
};

export default connect(
  (state) => {
    return {
      base: state.base,
      store: state.store,
    };
  },
  { ...action.base, ...action.store }
)(Detail);
