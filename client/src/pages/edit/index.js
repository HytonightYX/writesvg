import { inject, observer } from 'mobx-react';
import React from 'react';
import BraftEditor from 'braft-editor';
import { Form, Input as AntInput, Button, Icon, Select, Spin, message, Upload, Modal } from 'antd';
import { withRouter } from 'react-router';
import { SYSTEM_CONFIG } from '../../constant/config';

import { axios_get, axios_post } from '../../utils/axios';
import 'braft-editor/dist/index.css';
import './style.less';

const { Option } = Select;
const { BASE_QINIU_URL, QINIU_SERVER } = SYSTEM_CONFIG.qiniu;

@inject()
@observer
@withRouter
class Write extends React.Component {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
  }

  state = {
    data: [],
    value: [],
    fetching: false,
    submitting: false,
    qiniuToken: null,
    note: {},
    loading: false,
  };

  async componentDidMount() {
    axios_post('token/qiniu').then((data) => {
      this.setState(
        {
          qiniuToken: data.token,
        },
        () => {},
      );
    });

    const noteId = this.props.match.params.id;

    axios_get(`note/modify/${noteId}`).then((data) => {
      this.props.form.setFieldsValue({
        content: BraftEditor.createEditorState(data.content.raw),
      });
      this.setState({ note: data.content, imageHash: data.content.cover });
    });

    this.setState({ qiniuToken });
  }

  fetchUser = () => {
    this.setState({ data: [], fetching: true });
    axios_get('tag').then((body) => {
      const data = body.map((tag) => ({
        text: tag.name,
        value: tag.id,
      }));
      this.setState({ data, fetching: false });
    });
  };

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      this.setState({
        loading: false,
        imageHash: info.file.response.hash,
      });

      this.props.form.setFieldsValue({
        cover: info.file.response.hash,
      });
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFields((error, values) => {
      if (!error) {
        const noteId = this.props.match.params.id;
        const submitData = {
          title: values.title,
          raw: values.content.toRAW(),
          html: values.content.toHTML(),
          tag: values.tag.map((item) => item.key).join(','),
          cover: values.cover,
          status: 2,
          id: noteId,
        };

        this.setState({ submitting: true });
        axios_post('note/update', submitData)
          .then((data) => {
            setTimeout(() => {
              this.props.history.push('/');
            }, 500);
          })
          .finally(() => {
            this.setState({ submitting: false });
          });
      } else {
        message.error('??????????????????');
      }
    });
  };

  myUploadFn = (param) => {
    const serverURL = QINIU_SERVER;
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    const token = this.state.qiniuToken;

    const successFn = (response) => {
      param.success({
        url: `${BASE_QINIU_URL + JSON.parse(xhr.responseText).hash}?imageslim`,
      });
    };

    const progressFn = (event) => {
      // ?????????????????????????????????param.progress
      param.progress((event.loaded / event.total) * 100);
    };

    const errorFn = (response) => {
      // ???????????????????????????param.error
      param.error({
        msg: 'unable to upload.',
      });
    };

    xhr.upload.addEventListener('progress', progressFn, false);
    xhr.addEventListener('load', successFn, false);
    xhr.addEventListener('error', errorFn, false);
    xhr.addEventListener('abort', errorFn, false);

    fd.append('file', param.file);
    fd.append('token', token);
    xhr.open('POST', serverURL, true);
    xhr.send(fd);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { fetching, data, submitting, imageHash, qiniuToken, loading } = this.state;
    const uploadButton = (
      <div>
        <Icon type='plus' />
        <div className='ant-upload-text'>????????????</div>
      </div>
    );

    const editorProps = {
      media: {
        uploadFn: this.myUploadFn,
      },
    };

    return (
      <div className='g-edit'>
        <Form onSubmit={this.handleSubmit} className='m-form'>
          <Form.Item style={{ marginBottom: 0 }}>
            {getFieldDecorator('cover', {
              rules: [{ required: false, message: '???????????????' }],
            })(
              <div className='upload'>
                <div style={{ margin: '0 auto', textAlign: 'center' }}>
                  <Spin spinning={loading}>
                    <Upload
                      name='file'
                      listType='picture-card'
                      className='avatar-uploader'
                      showUploadList={false}
                      action={QINIU_SERVER}
                      data={{ token: qiniuToken }}
                      onChange={this.handleChange}
                    >
                      {imageHash ? (
                        <img
                          src={`${BASE_QINIU_URL + imageHash}?imageslim`}
                          alt='image'
                          style={{ width: '100%', maxWidth: '600px' }}
                        />
                      ) : (
                        uploadButton
                      )}
                    </Upload>
                  </Spin>
                </div>
              </div>,
            )}
          </Form.Item>

          <Form.Item style={{ marginBottom: 5 }}>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '???????????????' }],
              initialValue: this.state.note.title,
            })(<AntInput className='title-input' placeholder='???????????????' />)}
          </Form.Item>

          <Form.Item>
            {getFieldDecorator('content', {
              validateTrigger: 'onBlur',
              rules: [
                {
                  required: true,
                  validator: (_, value, callback) => {
                    if (value.isEmpty()) {
                      callback('?????????????????????');
                    } else {
                      callback();
                    }
                  },
                },
              ],
            })(<BraftEditor {...editorProps} className='m-editor' placeholder='?????????????????????' />)}
          </Form.Item>

          <Form.Item className='m-flex-row'>
            {getFieldDecorator('tag', {
              rules: [
                {
                  required: true,
                },
              ],
            })(
              <Select
                size='large'
                mode='multiple'
                labelInValue
                placeholder='????????????...'
                notFoundContent={fetching ? <Spin size='small' /> : null}
                filterOption={false}
                onSearch={this.fetchUser}
                style={{ width: '400px' }}
              >
                {data.map((d) => (
                  <Option key={d.value}>{d.text}</Option>
                ))}
              </Select>,
            )}

            <Button size='large' htmlType='submit' loading={submitting}>
              ??????
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Write;
