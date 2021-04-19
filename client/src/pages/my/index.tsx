import React, { useCallback } from 'react';
import { Spin } from 'antd';
import { Link } from 'react-router-dom';
import { Placeholder } from 'semantic-ui-react';
import ICON from '../../asset/icon';
import FixedBar from '../../components/fixedbar';
import ImageLoader from '../../components/image-loader';
import LazyLoad from 'react-lazyload';
import { useMyPosts, usePostDelete } from 'src/utils/request';
import { Post } from 'src/utils/types';
import { LoadingOutlined } from '@ant-design/icons';
import './style.less';

export function Mine() {
  const { data: postList, isLoading } = useMyPosts();

  const { mutate: deletePost } = usePostDelete();

  const doDel = useCallback((id: number) => {
    deletePost(id);
  }, []);

  return (
    <div className='g-find'>
      <div className='m-find'>
        <Spin spinning={isLoading} indicator={<LoadingOutlined style={{ fontSize: 32, color: '#fd281a' }} />}>
          <div className='note-list'>
            {postList?.map((post: Post) => {
              return (
                <div className='note-card' key={post.id}>
                  <div style={{ width: 400, overflow: 'hidden' }}>
                    <LazyLoad
                      height={200}
                      once
                      throttle={250}
                      placeholder={
                        <Placeholder style={{ height: 200, width: 400 }}>
                          <Placeholder.Image />
                        </Placeholder>
                      }
                    >
                      <ImageLoader
                        src={
                          post.cover
                            ? `${post.cover}?imageslim`
                            : `https://picsum.photos/400/200?random=${Math.floor(Math.random() * 1000)}`
                        }
                      />
                    </LazyLoad>
                  </div>

                  <div className='card-content'>
                    <div className='note-title'>
                      <Link to={`/post/${post.id}`}>{post.title}</Link>
                    </div>

                    <div className='note-attr'>
                      <div className='left'>
                        <Link to={`/edit/${post.id}`}>
                          <span>编辑</span>
                        </Link>
                        <span
                          onClick={() => {
                            doDel(post.id);
                          }}
                        >
                          删除
                        </span>
                      </div>

                      <div className='like'>
                        <div>
                          <img src={ICON.bookmark} alt='' />
                          <span>{post.likeNum}</span>
                        </div>
                        <div>
                          <img src={ICON.comment} alt='' />
                          <span>{post.collectNum}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Spin>

        <div className='right-bar'></div>
      </div>

      <FixedBar />
    </div>
  );
}
