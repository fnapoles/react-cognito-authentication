import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Message from "./components/ui/Message";

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

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [successMessageOpen, setSuccessMessageOpen] = useState(false);

  useEffect(() => {
    Amplify.configure({
      Auth: {
        region: process.env.REACT_APP_REGION,
        userPoolId: process.env.REACT_APP_USER_POOL_ID,
        userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID,
      },
    });
  });

  // useEffect(() => {
  //   async function getUser() {
  //     if (isLoggedIn) {
  //       let tempUser = await Auth.currentAuthenticatedUser();
  //       setCurrentUser((prevCurrentUser) => tempUser);
  //     }
  //   };
  //   getUser();
  // }, [isLoggedIn]);

  window.onbeforeunload = () => {
    localStorage.clear();
  };

  const sessionHandler = async (status) => {
    if (status) {
      let tempUser = await Auth.currentAuthenticatedUser();
      setCurrentUser((prevCurrentUser) => tempUser);
      setIsLoggedIn(true);
    }
  };

  const tabHandler = (e, newValue) => {
    setSelectedTab(newValue);
  };

  const logoutHandler = (status) => {
    if (status) {
      Auth.signOut()
        .then(() => {
          setCurrentUser(null);
          setIsLoggedIn(false);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const registrationHandler = (isRegistered) => {
    if (isRegistered) {
      const verificationMessage =
        "We sent a verification email to complete the registration. Please, confirm before signing in.";
      setSelectedTab(0);
      setSuccessMessage(verificationMessage);
      setSuccessMessageOpen(true);
      setTimeout(() => {
        setSuccessMessage((prevErrorMessage) => "");
        setSuccessMessageOpen(false);
      }, [3000]);
    }
  };

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
          <Login onLogin={sessionHandler} />
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <Registration onRegistration={registrationHandler} />
        </TabPanel>

        <Message
          message={successMessage}
          type="success"
          open={successMessageOpen}
        />
      </div>
    );
  } else {
    return (
      <div className="App">
        {currentUser && (
          <Dashboard user={currentUser} onLogout={logoutHandler} />
        )}
      </div>
    );
  }
}

export default App;
