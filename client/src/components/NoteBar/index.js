import React from 'react';
import './style.less';
import { LikeOutlined, LikeFilled, StarOutlined, StarFilled, LinkOutlined } from '@ant-design/icons';

export default (props) => {
  return (
    <div className='g-notebar'>
      <div className='m-icon' onClick={props.doLike}>
        {props?.status.like ? <LikeFilled /> : <LikeOutlined />}
      </div>

      <div className='m-icon' onClick={props.doCollect}>
        {props?.status.collect ? <StarFilled /> : <StarOutlined />}
      </div>
    </div>
  );
};
