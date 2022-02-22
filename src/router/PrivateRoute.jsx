import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import routes from '../constants/route';
import Layout from '../components/Layout';

export default function PrivateRoute({ Component, ...rest }) {
  const accessToken = useSelector((state) => state.auth.accessToken);
  return (
    <Layout>
      <Route
        {...rest}
        render={(props) =>
          accessToken ? (
            <Component {...props} />
          ) : (
            <Redirect to={routes.LOGIN} />
          )
        }
      />
    </Layout>
  );
}
