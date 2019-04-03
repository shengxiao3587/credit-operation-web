/* eslint-disable import/no-dynamic-require,no-unused-vars,comma-spacing,max-len */
import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import asyncComponent from '../../components/AsyncComponent';
import PrivateRoute from '../../components/PrivateRoute';
import ManageRoute from '../../components/ManageRoute';

const Routes = () => (
  <Switch>
    <PrivateRoute key="Customer" exact path="/Manage/Customer" component={asyncComponent(() => import('./Customer'))} />
    <PrivateRoute key="LoginLog" exact path="/Manage/LoginLog" component={asyncComponent(() => import('./LoginLog'))} />
    <PrivateRoute key="Notice" exact path="/Manage/Notice" component={asyncComponent(() => import('./Notice'))} />
    <PrivateRoute key="NoticeDetail" exact path="/Manage/NoticeDetail/:id" component={asyncComponent(() => import('./NoticeDetail'))} />
    <PrivateRoute key="RoleDetail" exact path="/Manage/RoleDetail/:id" component={asyncComponent(() => import('./RoleDetail'))} />
    <PrivateRoute key="Tpl" exact path="/Manage/Tpl" component={asyncComponent(() => import('./Tpl'))} />
    <PrivateRoute key="User" exact path="/Manage/User" component={asyncComponent(() => import('./User'))} />
    <PrivateRoute key="UserDetail" exact path="/Manage/UserDetail/:id" component={asyncComponent(() => import('./UserDetail'))} />
    <PrivateRoute key="UserSetting" exact path="/Manage/UserSetting" component={asyncComponent(() => import('./UserSetting'))} />
    <PrivateRoute key="Product" exact path="/Manage/Product" component={asyncComponent(() => import('./Product'))} />
    <PrivateRoute key="ProductDetail" exact path="/Manage/ProductDetail/:id" component={asyncComponent(() => import('./ProductDetail'))} />
    <PrivateRoute key="SurveyModal" exact path="/Manage/SurveyModal/:id" component={asyncComponent(() => import('./SurveyModal'))} />
    <PrivateRoute key="CreditAssessment" exact path="/Manage/CreditAssessment/:id" component={asyncComponent(() => import('./CreditAssessment'))} />
    <PrivateRoute key="Withdraw" exact path="/Manage/Withdraw" component={asyncComponent(() => import('./Withdraw'))} />
    <PrivateRoute key="WithdrawCheck" exact path="/Manage/WithdrawCheck" component={asyncComponent(() => import('./WithdrawCheck'))} />
    <PrivateRoute key="WithdrawCheckDetail" exact path="/Manage/WithdrawCheckDetail/:id" component={asyncComponent(() => import('./WithdrawCheckDetail'))} />
    <PrivateRoute key="WithdrawDetail" exact path="/Manage/WithdrawDetail/:id" component={asyncComponent(() => import('./WithdrawDetail'))} />
    <PrivateRoute key="ProductMonitor" exact path="/Manage/ProductMonitor" component={asyncComponent(() => import('./ProductMonitor'))} />
    <PrivateRoute key="CategoryDetail" exact path="/Manage/CategoryDetail" component={asyncComponent(() => import('./CategoryDetail'))} />
    <PrivateRoute key="CheckOrder" exact path="/Manage/CheckOrder" component={asyncComponent(() => import('./CheckOrder'))} />
    <PrivateRoute key="ExpressDetail" exact path="/Manage/ExpressDetail/:id" component={asyncComponent(() => import('./ExpressDetail'))} />
    <PrivateRoute key="ExamineList" exact path="/Manage/ExamineList" component={asyncComponent(() => import('./ExamineList'))} />
    <PrivateRoute key="CreditDetail" exact path="/Manage/CreditDetail/:id" component={asyncComponent(() => import('./CreditDetail'))} />
    <PrivateRoute key="CreditList" exact path="/Manage/CreditList" component={asyncComponent(() => import('./CreditList'))} />
    <PrivateRoute key="BigDataCreditReport" exact path="/Manage/BigDataCreditReport" component={asyncComponent(() => import('./BigDataCreditReport'))} />
    <PrivateRoute key="OnsiteSurvey" exact path="/Manage/OnsiteSurvey/:id" component={asyncComponent(() => import('./OnsiteSurvey'))} />
    <PrivateRoute key="RepayAudit" exact path="/Manage/RepayAuditList" component={asyncComponent(() => import('./RepayAuditList'))} />
    <PrivateRoute key="RepayAuditDetail" exact path="/Manage/RepayAuditDetail/:id" component={asyncComponent(() => import('./RepayAuditDetail'))} />
    <PrivateRoute key="RepayDetail" exact path="/Manage/RepayDetail/:id" component={asyncComponent(() => import('./RepayDetail'))} />
    <PrivateRoute key="Organization" exact path="/Manage/Organization" component={asyncComponent(() => import('./Organization'))} />
    <PrivateRoute key="OrganizationDetail" exact path="/Manage/OrganizationDetail/:id" component={asyncComponent(() => import('./OrganizationDetail'))} />
    <PrivateRoute key="OrganizationView" exact path="/Manage/OrganizationView/:id" component={asyncComponent(() => import('./OrganizationView'))} />
    <PrivateRoute key="AccountAssociated" exact path="/Manage/AccountAssociated" component={asyncComponent(() => import('./AccountAssociated'))} />
    <ManageRoute path="/Manage" />
    <Redirect to="/404" />
  </Switch>
);

export default Routes;
