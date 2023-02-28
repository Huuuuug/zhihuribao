import * as TYPES from "../action-types";
import _ from "../../utils/utils";

const initial = {
  info: null,
};

export default function baseReducer(state = initial, action) {
  state = _.clone(state);
  switch (action.type) {
    // 更新登录者信息
    case TYPES.BASE_INFO:
      state.info = action.info;
      break;
    default:
  }
  return state;
}