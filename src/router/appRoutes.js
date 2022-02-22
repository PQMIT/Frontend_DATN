import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import User from '../pages/User';
import Contest from '../pages/Contest';
import GroupQuestion from '../pages/GroupQuestion';
import Question from '../pages/Question';
import ExamTest from '../pages/ExamTest';
import ExamDetail from '../pages/ExamDetail';
import routes from '../constants/route';

export default [
  {
    path: routes.LOGIN,
    component: Login,
    exact: true,
    restricted: true,
    isPrivate: false,
  },
  {
    path: routes.REGISTER,
    component: Register,
    exact: true,
    restricted: true,
    isPrivate: false,
  },
  {
    path: routes.HOME,
    component: Home,
    exact: true,
    restricted: false,
    isPrivate: true,
  },
  {
    path: routes.USER,
    component: User,
    exact: true,
    restricted: false,
    isPrivate: true,
  },
  {
    path: routes.CONTEST,
    component: Contest,
    exact: true,
    restricted: false,
    isPrivate: true,
  },
  {
    path: routes.GROUP_QUESTIONS,
    component: GroupQuestion,
    exact: true,
    restricted: false,
    isPrivate: true,
  },
  {
    path: routes.QUESTION,
    component: Question,
    exact: true,
    restricted: false,
    isPrivate: true,
  },
  {
    path: routes.EXAM_TEST,
    component: ExamTest,
    exact: true,
    restricted: false,
    isPrivate: true,
  },
  {
    path: routes.EXAM_DETAIL,
    component: ExamDetail,
    exact: true,
    restricted: false,
    isPrivate: true,
  },
];
