import { inject, observer } from 'mobx-react'
import * as React from 'react'
import BraftEditor from 'braft-editor'
import { Form, Input as AntInput, Button, Icon, Select, Spin, message, Upload, Modal } from 'antd'
import debounce from 'lodash/debounce'
import { SYSTEM_CONFIG } from '../../constant/config'
import 'braft-editor/dist/index.css'
import './style.less'
import { axios_get, axios_post } from '../../util/axios'
import { getToken } from '../../util/qiniu'

const {Option} = Select
const {BASE_QINIU_URL, QINIU_SERVER} = SYSTEM_CONFIG.qiniu

@Form.create()
@inject()
@observer
class Write extends React.Component {
	constructor(props) {
		super(props)
		this.lastFetchId = 0
		this.fetchUser = debounce(this.fetchUser, 800)
	}

	state = {
		data: [],
		value: [],
		fetching: false,
		submitting: false
	}

	fetchUser = () => {
		this.setState({data: [], fetching: true})
		axios_get('tag')
			.then(body => {
				const data = body.map(tag => ({
					text: tag.name,
					value: tag.id,
				}))
				this.setState({data, fetching: false})
			})
	}

	handleChange = info => {
		if (info.file.status === 'uploading') {
			this.setState({loading: true})
			return
		}
		if (info.file.status === 'done') {
			this.setState({
				loading: true,
				imageHash: info.file.response.hash
			})

			this.props.form.setFieldsValue({
				cover: info.file.response.hash,
			});
		}
	}

	handleSubmit = (event) => {
		event.preventDefault()
		this.props.form.validateFields((error, values) => {
			if (!error) {

				const submitData = {
					title: values.title,
					raw: values.content.toRAW(),
					html: values.content.toHTML(),
					tag: values.tag.map(item => item.key).join(','),
					cover: values.cover,
					status: 2
				}

				this.setState({submitting: true})
				axios_post('note/add', submitData)
					.then(data => {
						console.log(data)
					})
					.finally(() => {
						this.setState({submitting: false})
					})
			} else {
				message.error('提交发生错误')
			}
		})
	}

	getUploadToken = () => {
		const qiniuToken = getToken()
		console.log('获取qiniu的token', qiniuToken)
		this.setState({qiniuToken})
	}

	render() {
		const {getFieldDecorator} = this.props.form
		const {fetching, data, submitting, imageHash, qiniuToken} = this.state

		const uploadButton = (
			<div>
				<Icon type="plus"/>
				<div className="ant-upload-text">上传题图</div>
			</div>
		)

		return (
			<div className="g-write">

				<Form onSubmit={this.handleSubmit} className="m-form">
					<Form.Item style={{marginBottom: 0}}>
						{getFieldDecorator('cover', {
							rules: [{required: false, message: '请上传题图'}],
						})(
							<div className="upload">
								<div style={{background: '#666666', width: 600, height: 250, margin: '20px auto 30px'}}>
									<Upload
										name="file"
										listType="picture-card"
										className="avatar-uploader"
										showUploadList={false}
										action={QINIU_SERVER}
										data={{token: qiniuToken}}
										beforeUpload={this.getUploadToken}
										onChange={this.handleChange}
									>
										{imageHash ?
											<img src={BASE_QINIU_URL + imageHash} alt="image" style={{width: '100%'}}/> : uploadButton}
									</Upload>
								</div>
							</div>
						)}
					</Form.Item>

					<Form.Item style={{marginBottom: 5}}>
						{getFieldDecorator('title', {
							rules: [{required: true, message: '请输入标题'}],
							initialValue: ''
						})(
							<AntInput
								className="title-input"
								placeholder="请输入标题"
							/>,
						)}
					</Form.Item>

					<Form.Item>
						{getFieldDecorator('content', {
							validateTrigger: 'onBlur',
							rules: [{
								required: true,
								validator: (_, value, callback) => {
									if (value.isEmpty()) {
										callback('请输入正文内容')
									} else {
										callback()
									}
								}
							}],
						})(
							<BraftEditor
								ref={instance => this.editorInstance = instance}
								className="m-editor"
								placeholder="请输入正文内容"
							/>
						)}
					</Form.Item>

					<Form.Item className="m-flex-row">
						{getFieldDecorator('tag', {
							rules: [{
								required: true,
							}],
						})(
							<Select
								size="large"
								mode="multiple"
								labelInValue
								placeholder="选择标签..."
								notFoundContent={fetching ? <Spin size="small"/> : null}
								filterOption={false}
								onSearch={this.fetchUser}
								style={{width: '400px'}}
							>
								{data.map(d => (
									<Option key={d.value}>{d.text}</Option>
								))}
							</Select>
						)}

						<Button size="large" htmlType="submit" loading={submitting}>提交</Button>
					</Form.Item>
				</Form>
			</div>
		)
	}
}

export default Write
