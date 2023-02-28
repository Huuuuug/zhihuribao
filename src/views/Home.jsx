import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import _ from "../utils/utils";
import "./home.less";
import { Swiper, Image, Divider, DotLoading } from "antd-mobile";
import { Link } from "react-router-dom";
import api from "../api";
import HomeHead from "@/components/HomeHead";
import NewsItem from "@/components/NewsItem";
import SkeletonAgain from "@/components/SkeletonAgain";

const Home = function Home() {
  /** 创建所需的状态 */
  const [today, setToday] = useState(_.formatTime(null, "{0}{1}{2}")),
    [bannerData, setBannerData] = useState([]),
    [newsList, setNewsList] = useState([]);

  const aa = useSearchParams();
  const loadMoreRef = useRef();
  /** 第一次渲染完毕 发请求 */
  useEffect(() => {
    getBannerData();
  }, []);

  /** 第一次渲染完毕 设置监听器 实现触底加载 */
  useEffect(() => {
    let ob = new IntersectionObserver(async (changes) => {
      const { isIntersecting } = changes[0];
      if (isIntersecting) {
        // 加载更多的按钮出现在视口中 [也就是触底了]
        const time = newsList[newsList.length - 1]["date"];
        try {
          const res = await api.queryNewsBefore(time);
          newsList.push(res);
          setNewsList([...newsList]);
        } catch (error) {}
      }
    });
    const loadMoreBox = loadMoreRef.current;
    ob.observe(loadMoreRef.current);
    // 组建释放的时候 手动销毁监听器
    return () => {
      ob.unobserve(loadMoreBox);
      ob = null;
    };
  }, []);

  const getBannerData = async () => {
    try {
      const { date, stories, top_stories } = await api.queryNewsLatest();
      setToday(date);
      setBannerData(top_stories);
      // 更新新闻列表状态
      newsList.push({
        date,
        stories,
      });
      setNewsList([...newsList]);
    } catch (error) {}
  };

  return (
    <div className="home-wrapper">
      {/* 头部 */}
      <HomeHead today={today} />
      {/* 轮播图 */}
      <div className="swiper-wrapper">
        {bannerData.length > 0 ? (
          <Swiper autoplay="true" loop>
            {bannerData.map((item) => {
              const { id, image, title, hint } = item;
              return (
                <Swiper.Item key={id}>
                  <Link
                    to={{
                      pathname: `/detail/${id}`,
                    }}
                  >
                    <Image src={image} lazy />
                    <div className="desc">
                      <h3 className="title">{title}</h3>
                      <p className="author">{hint}</p>
                    </div>
                  </Link>
                </Swiper.Item>
              );
            })}
          </Swiper>
        ) : null}
      </div>
      {/* 新闻列表 */}
      {newsList.length === 0 ? (
        <SkeletonAgain />
      ) : (
        <>
          {newsList.map((item, index) => {
            const { date, stories } = item;
            return (
              <div className="news-wrapper" key={date}>
                {index !== 0 ? (
                  <Divider contentPosition="left">{_.formatTime(date, "{1}月{2}日")}</Divider>
                ) : null}
                <div className="list">
                  {stories.map((store) => {
                    return <NewsItem key={store.id} info={store} />;
                  })}
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* 加载更多 */}
      <div
        className="load-more"
        ref={loadMoreRef}
        style={{
          display: newsList.length === 0 ? "none" : "block",
        }}
      >
        <DotLoading /> 数据加载中
      </div>
    </div>
  );
};

export default Home;
