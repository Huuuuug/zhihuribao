import React from "react";
import "./NewsItem.less";
import { Image } from "antd-mobile";
import img from "../assets/images/timg.jpg";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const NewsItem = function (props) {
  const { info } = props;
  if (!info) return null;
  let { images, image, hint } = info;
  if (!images) images = [image];
  if (!Array.isArray(images)) images = [""];
  return (
    <div className="news-item-wrapper">
      <Link to={{ pathname: `/detail/${info.id}` }}>
        <div className="content">
          <h4 className="title">{info.title}</h4>
          {hint ? <p className="author">{hint}</p> : null}
        </div>
        <Image src={images[0]} lazy />
      </Link>
    </div>
  );
};
NewsItem.defaultProps = {
  info: null,
};
NewsItem.propTypes = {
  info: PropTypes.object,
};

export default NewsItem;
