import { connect } from 'react-redux';
import { actions } from '../modules';
import { moduleName } from '../index';
import { getMenuRouter } from '../../../../selectors';

import CategoryDetail from '../components';

const mapDispatchToProps = {
  ...actions,
};

const mapStateToProps = (state) => {
  const localState = state[moduleName];
  return {
    ...localState,
    breadcrumb: getMenuRouter(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryDetail);
