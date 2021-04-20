import React, { useCallback, useEffect, useState } from 'react';
import { Form, Input, Button, Spin, message, Upload, Image } from 'antd';
import { ArrowRightOutlined, InboxOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import * as qiniu from 'qiniu-js';
import { SYSTEM_CONFIG } from '../../constant/config';
import { useCreatePost, useQiniuToken } from 'src/utils/request';
import './style.less';
import { StyledBlock, Vectorizer } from './styled';
import { Block } from 'src/utils/types';
import { useMutation } from 'react-query';
import { svg2file } from 'src/utils/svg';
import { DebounceSelect, fetchTags } from './select';
import { axios_post } from 'src/utils/axios';

const { Item } = Form;
const { BASE_QINIU_URL, QINIU_SERVER } = SYSTEM_CONFIG.qiniu;

const CoverButton = () => (
  <div>
    <PlusOutlined />
    <div className='ant-upload-text'>上传题图</div>
  </div>
);

export function Write() {
  const { data: qiniuToken, isFetching: isTokenFetching } = useQiniuToken();
  const { mutate: createPost, isLoading: isSubmitting } = useCreatePost();

  const [form] = Form.useForm();
  const [blockData, setData] = useState<Block[]>([]);

  const [coverUrl, setImgHash] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);

  const { mutate: startPotrace, isLoading: isPotraceLoading } = useMutation((originUrl: string) =>
    axios_post('note/potrace', { originUrl }),
  );

  const submit = useCallback(
    (data) => {
      data.blocks = [...blockData];
      data.tags = tags.map((item: any) => item.value);
      createPost(data);
    },
    [blockData, tags],
  );

  const qiniuUpload = (file: File) => {
    return new Promise((reslove, reject) => {
      const observable = qiniu.upload(file, null, qiniuToken!);
      const observer = {
        error(err: any) {
          reject(err);
        },
        complete(res: any) {
          reslove(res.hash);
        },
      };
      const subscription = observable.subscribe(observer); // 上传开始
    });
  };

  const handleChange = useCallback((info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
    }
    if (info.file.status === 'done') {
      const { hash } = info.file.response;
      const url = `${BASE_QINIU_URL}${hash}`;
      setImgHash(url + '?imageslim');
      setLoading(false);
      form.setFieldsValue({ cover: url });
    }
  }, []);

  useEffect(() => {
    blockData.forEach((block) => {
      const { _id, originUrl, svgUrl } = block;
      if (originUrl && !svgUrl) {
        startPotrace(originUrl, {
          onSuccess: async (data) => {
            const { svg } = data;
            const file = svg2file(svg);
            const svgHash = await qiniuUpload(file);
            updateBlock(_id, { svgUrl: `${BASE_QINIU_URL + svgHash}?imageslim` });
          },
        });
      }
    });
    console.log(blockData);
  }, [blockData]);

  const pushBlock = () => {
    setData([...blockData, { _id: +new Date() }]);
  };

  const removeBlock = (_id: number) => {
    const removed = blockData.filter((item) => item._id !== _id);
    setData(removed);
  };

  const updateBlock = (_id: number, payload: Omit<Block, '_id'>) => {
    const updated = blockData.map((item) => {
      if (item._id === _id) {
        return { ...item, ...payload };
      }
      return item;
    });

    setData(updated);
  };

  const handleBlockChange = (info: any, _id: number) => {
    const { status } = info.file;
    if (status === 'done') {
      const { hash } = info.file.response;
      const url = `${BASE_QINIU_URL + hash}?imageslim`;

      setData(
        blockData.map((item) => {
          if (item._id === _id) {
            return { ...item, originUrl: url };
          }
          return item;
        }),
      );
    }
    if (status === 'error') {
      message.error(`${info.file.name} 上传失败.`);
    }
  };

  return (
    <div className='g-write'>
      <Form form={form} onFinish={submit} className='m-form'>
        <Item style={{ marginBottom: 0 }} name='cover' rules={[{ required: false, message: '请上传题图' }]}>
          <div className='upload'>
            <div style={{ margin: '0 auto', textAlign: 'center' }}>
              <Spin spinning={isTokenFetching}>
                <Upload
                  name='file'
                  listType='picture-card'
                  className='avatar-uploader'
                  showUploadList={false}
                  action={QINIU_SERVER}
                  data={{ token: qiniuToken }}
                  onChange={handleChange}
                >
                  {coverUrl ? <img src={coverUrl} alt='image' style={{ width: '100%' }} /> : <CoverButton />}
                </Upload>
              </Spin>
            </div>
          </div>
        </Item>

        <Item name='title' style={{ marginBottom: 5 }} rules={[{ required: true, message: '请输入标题' }]}>
          <Input className='title-input' placeholder='请输入标题' />
        </Item>

        <Item>
          <Vectorizer>
            {blockData.length > 0 ? (
              <div className='block-list'>
                {blockData.map((item) => {
                  const { originUrl, svgUrl } = item;
                  return (
                    <div className='block-container' key={item._id}>
                      <div className='col'>
                        {originUrl ? (
                          <Image className='block-image' src={originUrl} />
                        ) : (
                          <Upload
                            name='file'
                            listType='picture-card'
                            className='block-image'
                            showUploadList={false}
                            action={QINIU_SERVER}
                            data={{ token: qiniuToken }}
                            onChange={(info) => {
                              handleBlockChange(info, item._id);
                            }}
                          >
                            <p className='ant-upload-drag-icon'>
                              <InboxOutlined />
                            </p>
                            <p className='ant-upload-text'>请上传您的新闻图片</p>
                          </Upload>
                        )}
                      </div>

                      <div className='arrow'>
                        <ArrowRightOutlined />
                        <Button size='small' danger onClick={() => removeBlock(item._id)}>
                          删除区块
                        </Button>
                      </div>

                      <div className='col'>
                        {isPotraceLoading ? (
                          <LoadingOutlined />
                        ) : svgUrl ? (
                          <Image className='block-image' src={svgUrl} />
                        ) : (
                          <div className='block-image'>
                            <span>请先上传左侧原图</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <StyledBlock>请添加区块</StyledBlock>
            )}
          </Vectorizer>
        </Item>

        <div>
          <Button onClick={pushBlock} style={{ marginRight: 12 }}>
            添加区块
          </Button>
        </div>

        <div style={{ marginTop: 12 }}>
          <DebounceSelect
            mode='tags'
            value={tags}
            placeholder='请选择标签,允许自定义'
            fetchOptions={fetchTags}
            onChange={(newValue) => {
              setTags(newValue);
            }}
            style={{ width: '200px', marginRight: 12 }}
          />
          <Button type='primary' htmlType='submit' loading={isSubmitting}>
            提交
          </Button>
        </div>
      </Form>
    </div>
  );
}
