/* eslint-disable no-useless-return */
/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Paper, Tabs, Tab } from '@material-ui/core';
import useStyles from './index.style';
import UserInformation from './UserInformation';
import ChangePassword from './ChangePassword';

const menus = [
  {
    id: 0,
    heading: 'Thông tin cá nhân',
    component: <UserInformation />,
  },
  {
    id: 1,
    heading: 'Thay đổi mật khẩu',
    component: <ChangePassword />,
  },
];
const User = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [tab, setTab] = useState(0);

  const handleChangeTab = async (event, newValue) => {
    setTab(newValue);
  };

  const renderTab = () => {
    const item = menus.find((el) => el.id === tab);
    return item && item.component;
  };

  return (
    <div>
      <Paper className={classes.tab}>
        <Tabs
          value={tab}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
        >
          {menus.map((el) => (
            <Tab label={el.heading} key={el.id}>
              {el.heading}
            </Tab>
          ))}
        </Tabs>
      </Paper>
      {renderTab()}
    </div>
  );
};

export default User;
