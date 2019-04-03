export default {
  loanUsagesColumns: [
    {
      title: '进口商品品类',
      dataIndex: 'categoryName',
    },
    {
      title: '采购国家',
      dataIndex: 'purCountryName',
    },
    {
      title: '销售渠道',
      dataIndex: 'saleChannelName',
    },
    {
      title: '销售模式',
      dataIndex: 'saleTypeName',
    },
    {
      title: '贷款金额',
      dataIndex: 'creditLines',
      render: 'func:convertMoney',
    },
    {
      title: '境外品牌授权书',
      dataIndex: 'brandCertUrls',
      render: 'func:renderAuthorization',
    },
  ],
  entDataColumns: [
    {
      title: '企业名称',
      dataIndex: 'entName',
    },
    {
      title: '企业类型',
      dataIndex: 'entTypeName',
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
    },
    {
      title: '手机号码',
      dataIndex: 'contactPhone',
    },
    {
      title: '公司地址',
      dataIndex: 'entAddress',
    },
    {
      title: '年营业额',
      dataIndex: 'annualTurnover',
      render: 'func:convertMoney',
    },
  ],
  bigDataCreditColumns: [
    {
      fieldName: 'reportNo',
      displayName: '报告编号',
    },
    {
      fieldName: 'reportTime',
      displayName: '报告时间',
    },
    {
      fieldName: 'operateTime',
      displayName: '查询时间',
    },
    {
      fieldName: 'reportTime',
      displayName: '报告时间',
    },
    {
      fieldName: 'reportNo',
      displayName: '报告编号',
    },
    {
      fieldName: 'statusName',
      displayName: '初审结果',
    },
    {
      fieldName: 'entName',
      displayName: '查询企业',
    },
    {
      fieldName: 'operator',
      displayName: '操作员',
    },
  ],
  sceneSurveyColumns: [
    {
      fieldName: 'reportNo',
      displayName: '报告编号',
    },
    {
      fieldName: 'reportTime',
      displayName: '报告时间',
    },
    {
      fieldName: 'surveyors',
      displayName: '参与尽调人员',
    },
    {
      fieldName: 'operator',
      displayName: '操作员',
    },
    {
      fieldName: 'surveyTime',
      displayName: '调查日期',
    },
    {
      fieldName: 'operateTime',
      displayName: '操作时间',
    },
  ],
  examineAdviceColumns: [
    {
      title: '审批人',
      dataIndex: 'operator',
      key: 'operator',
    },
    {
      title: '审批结果',
      dataIndex: 'statusName',
      key: 'statusName',
    },
    {
      title: '建议',
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: '审批时间',
      dataIndex: 'operateTime',
      key: 'operateTime',
    },
  ],
};
