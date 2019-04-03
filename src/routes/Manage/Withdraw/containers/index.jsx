import { connect } from 'react-redux';
import { actions } from '../modules';
import { moduleName } from '../index';
import { getMenuRouter } from '../../../../selectors';
import Withdraw from '../components';
import { dict } from '../../../../store/dict';

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
    permission: state.common.permission[state.common.menusMap[`/Manage/${moduleName}`]] || {},
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Withdraw);

