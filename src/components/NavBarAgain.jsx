import React from "react";
import PropTypes from "prop-types";
import { NavBar } from "antd-mobile";
import "./NavBarAgain.less";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

const NavBarAgain = function (props) {
  const { title } = props;

  const navigate = useNavigate(),
    location = useLocation(),
    [usp] = useSearchParams();
  const handleBack = () => {
    // 特殊：登录页 & to值为/detail/xxx
    const to = usp.get("to");
    if (location.pathname === "login" && /^\/detail\/d+$/.test(to)) {
      navigate(to, { replace: true });
      return;
    }
    navigate(-1);
  };
  return (
    <NavBar className="navbar-again-wrapper" onBack={handleBack}>
      {title}
    </NavBar>
  );
};

NavBarAgain.defaultProps = {
  title: "个人中心",
};
NavBarAgain.propTypes = {
  title: PropTypes.string,
};

export default NavBarAgain;
