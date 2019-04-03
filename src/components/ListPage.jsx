import React from 'react';
import { ListPage } from '@f12/components';

export default (props) => {
  return (
    <ListPage
      buttonPos="table"
      hideReset
      searchButtonStyle={{ clear: 'none' }}
      xScroll={800}
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
      }}
      {...props}
    />
  );
};
