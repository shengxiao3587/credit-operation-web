import React, { Component } from 'react';
import { Button, Steps } from 'antd';
import { DetailPage } from '@f12/components';
import { parseFields } from '../../../../util';
import './index.scss';

const { Step } = Steps;

class View extends Component {
  componentDidMount() {
    this.props.load({
      id: this.props.match.params.id,
    });
  }


  back = () => {
    this.props.history.goBack();
  };

  render() {
    const {
      record,
      fields,
      list,
    } = this.props;
    return (
      <div style={{ width: '100%' }}>
        <DetailPage
          values={record}
          fields={parseFields.call(this, fields.map((field) => ({
            ...field,
            disabled:true,
          })))}
          topTitle="查看物流信息"
        >
          <Steps direction="vertical" progressDot current={list && list.length - 1}>
            {list && list.map((item, index) => {
                const key = `step${index}`;
                return (<Step title={item.time} description={item.desc} key={key} />);
              })
            }
          </Steps>
        </DetailPage>
        <Button
          type="primary"
          className="button-close"
          onClick={this.back}
        >
          关闭
        </Button>
      </div>
    );
  }
}

export default View;
