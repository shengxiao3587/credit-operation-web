import React from 'react';
import { DetailPage } from '@f12/components';

export default (props) => {
  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 12 },
  };

  return (
    <DetailPage
      {...props}
      buttonAlign="left"
      formItemLayout={formItemLayout}
    />
  );
};
