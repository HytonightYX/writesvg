import React from 'react';
import './style.less';
import { EditOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 8);
  }
};

const FixedBar = () => (
  <div className='g-fixedbar'>
    <Link to='/write'>
      <div className='m-icon m-red' onClick={() => {}}>
        <EditOutlined />
      </div>
    </Link>

    <div
      className='m-icon m-grey'
      onClick={() => {
        scrollToTop();
      }}
    >
      <ArrowUpOutlined />
    </div>
  </div>
);

export default FixedBar;
