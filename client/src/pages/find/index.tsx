import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Placeholder } from 'semantic-ui-react';
import LazyLoad from 'react-lazyload';
import ICON from '../../asset/icon';
import FixedBar from '../../components/fixedbar';
import ImageLoader from '../../components/image-loader';
import { FIND_MENU } from '../../constant/config';
import { dateToFromNow } from '../../utils/date';
import { useHot, usePosts, useTags } from 'src/utils/request';

import './style.less';

const NoteCard = ({ note }: { note: any }) => {
  if (!note) {
    return null;
  }
  return (
    <div className='note-card'>
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
              note.cover
                ? `${note.cover}?imageslim`
                : `https://picsum.photos/400/200?random=${Math.floor(Math.random() * 1000)}`
            }
          />
        </LazyLoad>
      </div>

      <div className='card-content'>
        <div className='note-title'>
          <Link to={`/post/${note.id}`}>{note.title}</Link>
        </div>

        <div className='note-attr'>
          <div className='user'>
            <img className='user-icon' src={note.avatar} alt='' />
            <span className='username'>{note.user_name}</span>
            <span className='update-time'>{dateToFromNow(note.created_at)}</span>
          </div>

          <div className='like'>
            <div>
              <img src={ICON.bookmark} alt='' />
              <span>{note.like_num}</span>
            </div>
            <div>
              <img src={ICON.comment} alt='' />
              <span>{note.collect_num}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function Find() {
  const [tab, setTab] = useState('all');
  const [tabId, setTabId] = useState(-1);
  const { status, data, error, isFetching } = usePosts(tabId);
  const { data: tags } = useTags();
  const { data: hotList } = useHot();

  const doChangeTab = (e: any) => {
    let key;
    switch (e.target.textContent) {
      case '所有':
        key = 'all';
        setTabId(-1);
        break;
      case '标签':
        key = 'tag';
        break;
      default:
        key = 'all';
    }

    setTab(key);
  };

  return (
    <div className='g-find'>
      <div className='m-find-tab'>
        <ul>
          {FIND_MENU.map((item) => (
            <li key={item.key} onClick={doChangeTab} className={`${tab === item.key && 'active'}`}>
              {item.title}
            </li>
          ))}
        </ul>
      </div>

      <div className='m-find'>
        <div>
          {tab === 'tag' && (
            <div className='m-tags-wrap'>
              {tags?.map((tag: any) => {
                return (
                  <div className='m-tag' key={`tab${tag.name}`} onClick={() => setTabId(tag.id)}>
                    # <span>{tag.name}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div className='note-list'>
            {tab === 'all' && data?.map((item: any) => <NoteCard key={`node-${item.id}`} note={item} />)}
            {tab === 'tag' && data?.map((item: any) => <NoteCard key={`node-${item.id}`} note={item} />)}
            {data?.length === 0 && <div className='no-data'>没有更多数据 😯</div>}
          </div>
        </div>

        <div className='find-right-bar'>
          <div className='title'>最热 · 精选</div>

          <div className='hot-list'>
            {hotList?.map((item: any) => {
              const { User: user } = item;
              return (
                <div className='item' key={`hot-${item.id}`}>
                  <div className='avatar'>
                    <img src={user.avatar} />
                  </div>

                  <div className='info'>
                    <div className='item-name'>{user.userName}</div>
                    <Link to={`note/${item.id}`}>
                      <span className='item-title'>{item.title}</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <FixedBar />
    </div>
  );
}
