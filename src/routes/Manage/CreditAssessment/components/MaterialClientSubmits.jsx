import React, { Component } from 'react';
import { Table } from 'antd';
import { ImagePicker } from '@f12/components';
import { parseFields, formatMoney } from '../../../../util';
import './material.scss';

class MaterialClientSubmits extends Component {
  evidence = (urls) => {
    const sequence = [
      'bizLicenceUrl',
      'importLicenceUrl',
      'creditRateUrl',
    ];
    const evidenceNames = [
      '企业营业执照',
      '进口许可证',
      '海关企业信用评级',
    ];
    const result = [];
    for (let i = 0; i < sequence.length; i += 1) {
      const url = urls[sequence[i]];
      result.push(url);
    }
    return (
      <ImagePicker
        width={173}
        height={116}
        value={result}
        type="file"
        getUrl={() => {}}
        disabled
        extras={evidenceNames}
        onPreview={(value, index) => {
          this.props.preview(true, result, index);
        }}
      />
    );
  }

  convertMoney = (text) => formatMoney(text, 100, 2);

  renderAuthorization = (text, record) => {
    const urls = record.brandCertUrls;
    return (
      <ImagePicker
        width={50}
        height={50}
        value={urls}
        type="file"
        getUrl={() => {}}
        disabled
        onPreview={(value, index) => {
          this.props.preview(true, urls, index);
        }}
      />
    );
  };

  render() {
    const {
      loanUsagesColumns,
      loanUsages,
      entData,
      entDataColumns,
      urls,
    } = this.props;
    return (
      <div className="material">
        {/* <span id="id-title-material">客户提交资料</span> */}
        <Table
          title={() => '贷款用途'}
          rowKey="categoryId"
          columns={parseFields.call(this, loanUsagesColumns)}
          dataSource={loanUsages}
          scroll={{ x: 800 }}
        />
        <Table
          title={() => '企业信息'}
          rowKey="entId"
          columns={parseFields.call(this, entDataColumns)}
          dataSource={entData}
          scroll={{ x: 800 }}
        />
        <span className="credit-cell-title">证明材料</span>
        <div id="id-div-evidence">
          <div id="id-file-evidence">
            {this.evidence(urls)}
          </div>
        </div>
      </div>
    );
  }
}

export default MaterialClientSubmits;
