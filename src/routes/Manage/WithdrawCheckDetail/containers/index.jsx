import { connect } from 'react-redux';
import { actions } from '../modules';
import { moduleName } from '../index';
import { common } from '../../../../store/common';
import { getMenuRouter } from '../../../../selectors';

import View from '../components';

const mapDispatchToProps = {
  ...actions,
  previewImg: common.previewImg,
};

const mapStateToProps = (state) => {
  const localState = state[moduleName];
  return {
    ...localState,
    breadcrumb: getMenuRouter(state),
    imgVisible: state.common.imgVisible,
    currentImgs: state.common.currentImgs,
    imgIndex: state.common.imgIndex,
    downloadName: state.common.downloadName,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(View);
