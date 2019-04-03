import React from 'react';
import { DetailPage, ModalForm, ImagePreview } from '@f12/components';
import { Row, Col, message, Icon } from 'antd';
import './index.scss';
import { getBaseUrl, parseFields } from '../../../../util';

class OnsiteSurvey extends React.Component {
  componentDidMount() {
    this.applyId = this.props.match.params.id;
    this.surveyId = (this.props.location.state || {}).surveyId;
    this.props.fetchSurvey({
      applyId: this.applyId,
      surveyId: this.surveyId,
    });
    this.isView = !!(this.props.location.state || {}).detail;
  }

  componentWillUnmount() {
    this.props.reset();
  }

  getColSpan = () => {
    if (this.isView) {
      return 12;
    }
    return 24;
  };

  back = () => {
    this.props.history.goBack();
  };

  save = (form) => {
    form.validateFieldsAndScroll({ force: true }, (err, values) => {
      if (!err) {
        if (this.surveyInfoValid(values)) {
          this.props.save({
            ...values,
            applyId: this.props.match.params.id,
            surveyId: this.surveyId,
          }).then((success) => {
            if (success) {
              this.props.history.goBack();
            }
          });
        }
      }
    });
  };

  surveyInfoValid = (values) => {
    const { surveyTime, surveyors } = values;
    const invalidDate = new Date(surveyTime) > Date.now();
    let invalidSurveyors = false;
    for (let i = 0; i < surveyors.length; i += 1) {
      const surveyor = surveyors[i];
      if (!/^[0-9A-Za-z\u4E00-\u9FA5\uF900-\uFA2D]{1,100}$/.test(surveyor)) {
        invalidSurveyors = true;
        break;
      }
    }
    if (invalidDate) {
      message.error('尽调日期不能选择今天之后的');
    }
    if (invalidSurveyors) {
      message.error('尽调人员名字最多100字符，仅支持中文、英文、数字');
    }
    return !invalidDate && !invalidSurveyors;
  };

  check = (form) => {
    form.validateFieldsAndScroll({ force: true }, (err, values) => {
      if (!err) {
        if (this.surveyInfoValid(values)) {
          this.props.showModal();
        }
      }
    });
  };

  renderHeader = () => {
    return (
      <Row>
        <Col span={2} style={{ width: '8.33333333%' }}>序号</Col>
        <Col span={6} style={{ width: '25%' }}>调查类目</Col>
        <Col span={16} style={{ width: '66.66666667%' }}>操作</Col>
      </Row>
    );
  };

  renderDisabled = () => {
    return this.isView;
  };

  renderCommentHidden = () => {
    return this.props.modalRecord.status.value === '2';
  };

  renderAfterDelete = (item) => {
    const newItem = [...item];
    newItem[0].deleteFlag = true;
    if (newItem[0].id) {
      this.props.afterDeleteReport(newItem[0]);
    }
  };

  renderUploaderText = () => {
    return <div className="uploader-text"><Icon type="plus" />点击上传</div>;
  };

  render() {
    const {
      topButtons,
      fieldsBefore,
      fieldsAfter,
      record,
      changeRecord,
      buttons,
      loading,
      changeModalRecord,
      modalFields,
      modalRecord,
      persistForm,
      modalLoading,
      cancelModal,
      modalVisible,
      imgVisible,
      currentImgs,
      preview,
      imgIndex,
    } = this.props;
    let { materials } = record;
    if (Object.prototype.toString.call(record.materials) === '[object Object]') {
      materials = [];
    }
    const materialFields = [];
    materials.forEach((item, index) => {
      // TODO data struct is changed
      const images = materials[index].fileUrl.value || materials[index].fileUrl;
      materialFields.push({
        label: '',
        name: `materials[${index}].id`,
        hidden: true,
      });
      materialFields.push({
        label: '序号',
        name: `materials[${index}].sequence`,
        colSpan: 2,
        wrapperSpan: 24,
        type: 'display',
        containerStyle: { width: '8.33333333%' },
      });
      materialFields.push({
        label: '类目',
        name: `materials[${index}].name`,
        colSpan: 6,
        wrapperSpan: 24,
        type: 'display',
        containerStyle: { width: '25%' },
      });
      materialFields.push({
        label: '文件',
        name: `materials[${index}].fileUrl`,
        type: 'file',
        text: 'func:renderUploaderText:run',
        mostPic: 5,
        height: 32,
        width: 180,
        showName: true,
        disabled: this.isView,
        hidden: this.isView && item.fileUrl.length === 0,
        getUrl: (res) => (res.resultData || {}).fileUrl,
        action: `${getBaseUrl()}/file/upload`,
        headers: {
          Authorization: localStorage.getItem('accessToken'),
        },
        fullValue: true,
        colSpan: 16,
        wrapperSpan: 24,
        containerStyle: { width: '66.66666667%' },
        onPreview: (value, i) => {
          preview(true, images, i);
        },
      });
    });
    const fields = [...fieldsBefore, ...materialFields, ...fieldsAfter];
    return (
      <React.Fragment>
        <ImagePreview
          visible={imgVisible}
          images={currentImgs}
          hide={() => {
            preview(false, currentImgs, imgIndex);
          }}
          index={imgIndex}
        />
        <DetailPage
          persistForm={persistForm}
          className="survey-container"
          loading={loading}
          topTitle="现场尽调"
          topButtons={parseFields.call(this, topButtons)}
          fields={parseFields.call(this, fields)}
          values={record}
          changeRecord={changeRecord}
          buttons={this.isView ? [] : parseFields.call(this, buttons)}
          buttonAlign="left"
          formItemLayout={{
            labelCol: {
              span: 0,
            },
            wrapperCol: {
              span: 16,
            },
          }}
        />
        <ModalForm
          visible={modalVisible}
          cusTitle="审核"
          okText="确定"
          cancelText="取消"
          onCreate={(values) => {
            this.props.check({
              ...values,
              ...this.props.form.getFieldsValue(),
              applyId: this.props.match.params.id,
              surveyId: this.surveyId,
            }).then((success) => {
              if (success) {
                this.props.history.goBack();
              }
            });
          }}
          onCancel={cancelModal}
          formWidth={450}
          fields={parseFields.call(this, modalFields)}
          changeRecord={changeModalRecord}
          values={modalRecord}
          confirmLoading={modalLoading}
        />
      </React.Fragment>
    );
  }
}

export default OnsiteSurvey;
