import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import timg from "../assets/images/timg.jpg";
import "./HomeHead.less";
import { connect } from "react-redux";
import action from "../store/action";

const HomeHead = function (props) {
  const { today, info, queryUserInfoAsync } = props;
  const navigate = useNavigate();
  /** 计算时间中的月和日 */
  const time = useMemo(() => {
    const [, mouth, day] = today.match(/^\d{4}(\d{2})(\d{2})$/),
      area = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];
    return {
      mouth: area[+mouth] + "月",
      day,
    };
  }, [today]);

  // 第一次渲染完 如果info中没有信息 我们尝试再派发一次 获取登录者信息
  useEffect(() => {
    if (!info) {
      queryUserInfoAsync();
    }
  }, []);

  const handleImageClick = () => {
    navigate("/personal");
  };
  return (
    <header
      className="home-head-wrapper"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="info">
        <div className="time">
          <span>{time.day}</span>
          <span>{time.mouth}</span>
        </div>
        <h2 className="title">知乎日报</h2>
      </div>
      <div className="picture" onClick={handleImageClick}>
        <img src={info ? info.pic : timg} alt="" />
      </div>
    </header>
  );
};

export default connect((state) => state.base, action.base)(HomeHead);
