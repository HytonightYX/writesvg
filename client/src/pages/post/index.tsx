import React from 'react';
import { useParams } from 'react-router';
import FixedBar from '../../components/fixedbar';
import NoteBar from '../../components/NoteBar';
import { dateToFromNow } from '../../utils/date';
import { usePost } from 'src/utils/request';
import './style.less';
import { Image } from 'antd';
import { Block } from 'src/utils/types';
import { LoadingOutlined } from '@ant-design/icons';

export function Note() {
  const { id } = useParams<any>();
  const { data: post } = usePost(id);

  return (
    <div className='g-note'>
      <div className='m-header'>
        <div className='header-img'>
          <Image
            height='354px'
            preview={false}
            src={post?.cover ? post.cover + '?imageslim' : 'https://picsum.photos/600/300'}
          />
        </div>

        <div className='title'>{post?.title}</div>

        <div className='info'>
          <div className='name'>
            <span className='user-icon'>
              <img src={post?.avatar} alt='' />
            </span>
            <span className='name'>{post?.userName}</span>
          </div>
          <div className='time'>{dateToFromNow(post?.createdAt)}</div>
        </div>
      </div>

      <div className='content'>
        {post?.blocks.map((block: Block) => (
          <Image src={block.svgUrl} placeholder={<LoadingOutlined />} width='100%' style={{ objectFit: 'contain' }} />
        ))}
      </div>

      <FixedBar />
      <NoteBar status={status} />
    </div>
  );
}

// class NotePage extends React.Component {
//   state = {
//     note: {},
//     status: { like: false, collect: false },
//   };

//   componentDidMount() {
//     const noteId = this.props.match.params.id;
//     this.setState({ loading: true });
//     const token = window.localStorage.getItem('token');
//     if (token) {
//       axios_get('note/isFavor/' + noteId).then((data) => {
//         this.setState({ status: data });
//       });
//     }

//     axios_get('note/' + noteId)
//       .then((data) => {
//         this.setState({ note: data });
//       })
//       .finally(() => this.setState({ loading: false }));
//   }

//   doLike = () => {
//     const noteId = this.props.match.params.id;
//     const url = `favor/${this.state.status.like ? 'dislike' : 'like'}/${noteId}`;
//     axios_get(url).then((data) => {
//       const _status = { ...this.state.status };
//       _status.like = !_status.like;
//       data.ok === 1 && this.setState({ status: _status });
//     });
//   };

//   doCollect = () => {
//     const noteId = this.props.match.params.id;

//     const url = `favor/${this.state.status.collect ? 'disCollect' : 'collect'}/${noteId}`;
//     axios_get(url).then((data) => {
//       const _status = { ...this.state.status };
//       _status.collect = !_status.collect;
//       data.ok === 1 && this.setState({ status: _status });
//     });
//   };

//   render() {
//     const { note, status } = this.state;
//     return (
//       <div className='g-note'>
//         <div className='m-header'>
//           <div className='header-img'>
//             <img
//               src={note.cover ? BASE_QINIU_URL + note.cover + '?imageslim' : 'https://picsum.photos/600/300'}
//               alt=''
//             />
//           </div>

//           <div className='title'>{note && note.title}</div>

//           <div className='info'>
//             <div className='name'>
//               <span className='user-icon'>
//                 <img src={note && note.avatar} alt='' />
//               </span>
//               <span className='name'>{note && note.user_name}</span>
//             </div>
//             <div className='time'>{dateToFromNow(note.created_at)}</div>
//           </div>
//         </div>

//         <div className='content'>
//           <div className='braft-output-content' dangerouslySetInnerHTML={{ __html: note && note.html }} />
//         </div>

//         <FixedBar />
//         <NoteBar status={status} doLike={this.doLike} doCollect={this.doCollect} />
//       </div>
//     );
//   }
// }

// export default Note;
