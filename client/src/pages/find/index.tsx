import { Spin } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Placeholder } from 'semantic-ui-react';
import LazyLoad from 'react-lazyload';
import ICON from '../../asset/icon';
import FixedBar from '../../components/fixedbar';
import ImageLoader from '../../components/image-loader';
import { FIND_MENU, SYSTEM_CONFIG } from '../../constant/config';

import { dateToFromNow } from '../../utils/date';
import { LoadingOutlined } from '@ant-design/icons';
import { usePosts } from 'src/utils/request';

import './style.less';

const { BASE_QINIU_URL } = SYSTEM_CONFIG.qiniu;

const NoteCard = ({ note }: { note: any }) => (
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
              ? `${BASE_QINIU_URL + note.cover}?imageslim`
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

export function Find() {
  const [tab, setTab] = useState('all');
  const { status, data, error, isFetching } = usePosts();

  const doChangeTab = (e: any) => {
    let key;
    switch (e.target.textContent) {
      case '所有':
        key = 'all';
        break;
      case '标签':
        key = 'tag';
        break;
      default:
        key = 'all';
    }

    // if (key === 'all') {
    //   axios_get('note/list').then((data) => {
    //     this.setState({ currNotes: data, fetchingNote: false });
    //   });
    // }

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
        {isFetching ? (
          <LoadingOutlined style={{ fontSize: 48 }} />
        ) : (
          <Spin spinning={isFetching} indicator={<LoadingOutlined style={{ fontSize: 32, color: '#fd281a' }} />}>
            {tab === 'tag' && (
              <div className='m-tags-wrap'>
                {tagList.map((tag: any) => {
                  return (
                    <div className='m-tag' key={`tab${tag.name}`} onClick={this.doSearch.bind(this, tag.id)}>
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
          </Spin>
        )}

        <div className='find-right-bar'>
          <div className='title'>最热 · 精选</div>

          <div className='hot-list'>
            {/* {hotList.map((item: any) => ( */}
            {[].map((item: any) => (
              <div className='item' key={`hot-${item.id}`}>
                <div className='avatar'>
                  <img src={item.avatar} alt='' />
                </div>

                <div className='info'>
                  <div className='item-name'>{item.user_name}</div>
                  <Link to={`note/${item.id}`}>
                    <span className='item-title'>{item.title}</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FixedBar />
    </div>
  );
}

// export class FindPage extends React.Component {
//   state = {
//     currtab: 'all', // all || follow || hot || tag
//     currNotes: [],
//     loading: false,
//     fetchingNote: false,
//     hotList: [],
//     tagList: [],
//   };

//   async componentDidMount() {
//     this.setState({ fetchingNote: true });
//     axios_get('note/list').then((data) => {
//       this.setState({ currNotes: data, fetchingNote: false });
//     });

//     axios_get('note/hot').then((data) => {
//       this.setState({ hotList: data });
//     });

//     axios_get('tag').then((data) => {
//       this.setState({ tagList: data });
//     });
//   }

//   /**
//    * 修改标签
//    */
//   doChangeTab = (e: any) => {
//     let key;
//     switch (e.target.textContent) {
//       case '所有':
//         key = 'all';
//         break;
//       case '标签':
//         key = 'tag';
//         break;
//       default:
//         key = 'all';
//     }

//     if (key === 'all') {
//       axios_get('note/list').then((data) => {
//         this.setState({ currNotes: data, fetchingNote: false });
//       });
//     }

//     this.setState({ currtab: key });
//   };

//   doSearch = (id: any) => {
//     axios_get(`note/byTag/${id}`).then((data) => {
//       this.setState({
//         currNotes: data.data,
//       });
//     });
//   };

//   render() {
//     const { currtab, currNotes, loading, fetchingNote, hotList, tagList } = this.state;

//     return (
//       <Suspense fallback={<div>Loading...</div>}>
//         <div className='g-find'>
//           <div className='m-find-tab'>
//             <ul>
//               {FIND_MENU.map((item) => (
//                 <li key={item.key} onClick={this.doChangeTab} className={`${currtab === item.key && 'active'}`}>
//                   {item.title}
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className='m-find'>
//             {loading ? (
//               <LoadingOutlined style={{ fontSize: 48 }} />
//             ) : (
//               <Spin spinning={fetchingNote} indicator={<LoadingOutlined style={{ fontSize: 32, color: '#fd281a' }} />}>
//                 {currtab === 'tag' && (
//                   <div className='m-tags-wrap'>
//                     {tagList.map((tag: any) => {
//                       return (
//                         <div className='m-tag' key={`tab${tag.name}`} onClick={this.doSearch.bind(this, tag.id)}>
//                           # <span>{tag.name}</span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}

//                 <div className='note-list'>
//                   {currtab === 'all' && currNotes.map((item, i) => <NoteCard key={`node-${i}`} note={item} />)}
//                   {currtab === 'tag' && currNotes.map((item, i) => <NoteCard key={`node-${i}`} note={item} />)}
//                   {currNotes.length === 0 && <div className='no-data'>没有更多数据 😯</div>}
//                 </div>
//               </Spin>
//             )}

//             <div className='find-right-bar'>
//               <div className='title'>最热 · 精选</div>

//               <div className='hot-list'>
//                 {hotList.map((item: any) => (
//                   <div className='item' key={`hot-${item.id}`}>
//                     <div className='avatar'>
//                       <img src={item.avatar} alt='' />
//                     </div>

//                     <div className='info'>
//                       <div className='item-name'>{item.user_name}</div>
//                       <Link to={`note/${item.id}`}>
//                         <span className='item-title'>{item.title}</span>
//                       </Link>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <FixedBar />
//         </div>
//       </Suspense>
//     );
//   }
// }
