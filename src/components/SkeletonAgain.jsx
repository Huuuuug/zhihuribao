import React from "react";
import { Skeleton } from "antd-mobile";
import "./SkeletonAgain.less";

const SkeletonAgain = function () {
  return (
    <div className="sleleton-again-wrapper">
      <Skeleton.Title animated />
      <Skeleton.Paragraph lineCount={6} animated />
    </div>
  );
};

export default SkeletonAgain;
