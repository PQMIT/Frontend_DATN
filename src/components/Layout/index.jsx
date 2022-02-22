/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import clsx from 'clsx';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Avatar,
  Box,
  Container,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Breadcrumbs,
} from '@material-ui/core';

import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Lock as LockIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Timer as TimerIcon,
} from '@material-ui/icons';
import routes from '../../constants/route';
import actions from '../../redux/actions';
import useStyles from './index.style';
import { setCookie } from '../../utils/cookie';

const menus = [
  {
    heading: 'Trang chủ',
    icon: <DashboardIcon />,
    route: routes.HOME,
  },
  {
    heading: 'Quản lý cuộc thi',
    icon: <TimerIcon />,
    route: routes.CONTEST,
  },
  {
    heading: 'Quản lý câu hỏi',
    icon: <AssignmentIcon />,
    route: routes.GROUP_QUESTIONS,
  },
  {
    heading: 'Thông tin tài khoản',
    icon: <PersonIcon />,
    route: routes.USER,
  },
];

const Layout = ({ children }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.user);
  const { pathname } = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpenMenuHeader = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenuHeader = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    setCookie('accessToken');
    dispatch(actions.auth.logout());
  };
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden,
            )}
          >
            <MenuIcon />
          </IconButton>
          <Avatar src="https://res.cloudinary.com/dfbongzx0/image/upload/v1621772719/bfvfvstmneai0d1z0byx.png" />
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            Multichoice
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography variant="body2">{userInfo && userInfo.name}</Typography>
            {userInfo && userInfo.avatar ? (
              <Avatar
                alt="avatar"
                src={userInfo.avatar}
                className={classes.avatar}
                onClick={handleOpenMenuHeader}
              />
            ) : (
              <Avatar
                aria-label="recipe"
                className={classes.avatar}
                onClick={handleOpenMenuHeader}
              >
                {(userInfo && userInfo.name && userInfo.name[0]) || 'T'}
              </Avatar>
            )}
          </Box>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleCloseMenuHeader}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {menus.map((el, index) => (
            <Link to={el.route} key={index} className={classes.link}>
              <ListItem
                button
                key={index}
                classes={{
                  root:
                    ((el.route === '/' && pathname === el.route) ||
                      (pathname.indexOf(el.route) >= 0 && el.route !== '/')) &&
                    classes.listItem,
                }}
              >
                <ListItemIcon>{el.icon}</ListItemIcon>
                <ListItemText primary={el.heading} />
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {children}
        </Container>
      </main>
    </div>
  );
};

export default Layout;
