/* eslint-disable no-useless-return */
import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { Paper, Tabs, Tab, Grid, Box, Typography } from '@material-ui/core';
import TabDetail from './TabDetail';
import useStyles from './index.style';
import apis from '../../apis';
import LoadingPage from '../../components/LoadingPage';

const menus = [
  { id: 0, heading: 'Tất cả cuộc thi' },
  { id: 1, heading: 'Đã tham gia' },
  { id: 2, heading: 'Đang diễn ra' },
  { id: 3, heading: 'Sắp diễn ra' },
  { id: 4, heading: 'Đã kết thúc' },
];

let contestsDefault = [];

const Home = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [tab, setTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [contests, setContests] = useState([]);
  const [contestsJoined, setContestsJoined] = useState([]);

  const fetchContests = async () => {
    const data = await apis.contest.getContests();
    if (data && data.status) {
      setContests(data.result.data);
      contestsDefault = [...data.result.data];
      setIsLoading(false);
    } else {
      enqueueSnackbar((data && data.message) || 'Fetch data failed', {
        variant: 'error',
      });
    }
  };

  const fetchContestsJoined = async () => {
    const data = await apis.contest.getContestsJoined();
    if (data && data.status) {
      setContestsJoined(data.result.contests);
    } else {
      enqueueSnackbar((data && data.message) || 'Fetch data failed', {
        variant: 'error',
      });
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  const handleChangeTab = async (event, newValue) => {
    setTab(newValue);
    const date = new Date();
    if (newValue === 0) {
      setContests([...contestsDefault]);
      return;
    }
    if (newValue === 1) {
      if (contestsJoined.length <= 0) {
        await fetchContestsJoined();
      }
      return;
    }
    if (newValue === 2) {
      const newContests = contestsDefault.filter((el) => {
        if (el.endTime && new Date(el.endTime) < date) return false;
        if (new Date(el.startTime) > date) return false;
        return true;
      });
      setContests([...newContests]);
      return;
    }
    if (newValue === 3) {
      const newContests = contestsDefault.filter(
        (el) => new Date(el.startTime) > date,
      );
      setContests([...newContests]);
      return;
    }
    if (newValue === 4) {
      const newContests = contestsDefault.filter(
        (el) => el.endTime && new Date(el.endTime) < date,
      );
      setContests([...newContests]);
      return;
    }
    return;
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <>
      <Box mb={1}>
        <Typography variant="h6" gutterBottom>
          Danh sách cuộc thi
        </Typography>
      </Box>
      <Paper className={classes.root}>
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

      {tab === 1 ? (
        <Grid container spacing={3}>
          {contestsJoined.map((el) => (
            <TabDetail item={el} />
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {contests.map((el) => (
            <TabDetail item={el} />
          ))}
        </Grid>
      )}
    </>
  );
};

export default Home;
