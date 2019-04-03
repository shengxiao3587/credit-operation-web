import React from 'react';
import { Tree } from 'antd';

const { TreeNode } = Tree;

export const renderTreeNodes = (data) =>
  data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.resourceName} key={item.resourceId}>
          {renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode title={item.resourceName} key={item.resourceId} />;
  });

export const shapeList = (list) => {
  list.forEach((item) => {
    const newItem = item;
    newItem.title = item.resourceName;
    newItem.key = item.resourceId;
    if (item.children && item.children.length) {
      shapeList(item.children);
    }
  });
  return list;
};

