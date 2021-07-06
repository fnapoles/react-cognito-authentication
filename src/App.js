import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import "./App.scss";
import Login from "./components/login/login";
import Registration from "./components/registration/register";
import Dashboard from "./components/dashboard/dashboard";
import Amplify, { Auth } from "aws-amplify";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

function App() {
  const classes = useStyles();

  const [isLoggedIn, setIsLoggedIn] = useState(Auth.user ? true : false);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    Amplify.configure({
      Auth: {
        region: process.env.REACT_APP_REGION,
        userPoolId: process.env.REACT_APP_USER_POOL_ID,
        userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID,
      },
    });
  });

  window.onbeforeunload = () => {
    localStorage.clear();
  };

  const sessionHandler = async (status) => {
    setIsLoggedIn(status);
  };

  const tabHandler = (e, newValue) => {
    console.log(newValue);
    setSelectedTab(newValue);
  };

  const registrationHandler = () => {};

  if (!isLoggedIn) {
    return (
      <div className="App">
        <Paper className={classes.root}>
          <Tabs
            value={selectedTab}
            onChange={tabHandler}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
        </Paper>
        <TabPanel value={selectedTab} index={0}>
          <Login status={isLoggedIn} onLogin={sessionHandler} />
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <Registration onRegistration={registrationHandler} />
        </TabPanel>
      </div>
    );
  } else {
    return (
      <div className="App">
        <Dashboard status={isLoggedIn} onLogout={sessionHandler} />
      </div>
    );
  }
}

export default App;
