import { connect } from 'react-redux';
import { actions } from '../modules';
import { moduleName } from '../index';
import { getMenuRouter } from '../../../../selectors';
import { dict } from '../../../../store/dict';

import View from '../components';

const mapDispatchToProps = {
  ...actions,
  dict,
};

const mapStateToProps = (state) => {
  const localState = state[moduleName];
  return {
    ...localState,
    breadcrumb: getMenuRouter(state),
    dicts: state.dict,
    permission: state.common.permission[state.common.menusMap['/Manage/Product']] || {},
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(View);
