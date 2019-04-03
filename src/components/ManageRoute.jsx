import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ManageRoute = ({ ...rest }) => (
  <Route
    {...rest}
    render={() => {
      let elem = null;
      const { menusArray } = window.storeManager.getState().common || { menusArray:['/Manage/UserSetting'] };
      if (!localStorage.getItem('accessToken')) {
        elem = (<Redirect to={{
          pathname: '/SignIn',
        }}
        />);
      } else if (menusArray.length > 1) {
        elem = (<Redirect to={{
          pathname: menusArray[0],
        }}
        />);
      }
      return elem;
    }}
  />
);

export default ManageRoute;
