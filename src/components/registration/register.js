import { useState } from "react";
import classes from "./register.module.scss";
import { Auth } from "aws-amplify";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import LockIcon from "@material-ui/icons/Lock";

const Registration = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    Auth.signUp({
      username,
      password,
    })
      .then((user) => {
        console.log(user);
        setUsername("");
        setPassword("");
        props.onRegistration(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const usernameChangeHandler = (e) => {
    e.preventDefault();
    setUsername(e.target.value);
  };

  const passwordChangeHandler = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <Grid item lg={4} sm={6} xs={10}>
        <Paper className={classes.paper}>
          <form id="registrationForm" onSubmit={submitHandler}>
            <LockIcon color="primary" fontSize="large" />
            <div className={classes.inputs}>
              <TextField
                id="username"
                label="Username"
                type="text"
                value={username}
                onChange={usernameChangeHandler}
              />
            </div>
            <div className={classes.inputs}>
              <TextField
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={passwordChangeHandler}
              />
            </div>
            <div className={classes.inputs}>
              <Button
                color="primary"
                type="submit"
                id="submitButton"
                size="large"
              >
                REGISTER
              </Button>
            </div>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Registration;
