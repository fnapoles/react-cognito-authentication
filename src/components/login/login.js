import { useState } from "react";
import classes from "./login.module.scss";
import { Auth } from "aws-amplify";
import Message from "../ui/Message";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import LockIcon from "@material-ui/icons/Lock";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openUsernameDialog, setOpenUsernameDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageOpen, setErrorMessageOpen] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    Auth.signIn({
      username,
      password,
    })
      .then((user) => {
        setUsername("");
        setPassword("");
        props.onLogin(true);
      })
      .catch((err) => {
        showErrorHandler(err.message);
      });
  };

  const onChangeHandler = (e) => {
    switch (e.target.id) {
      case "login-username":
      case "send-username":
        setUsername(e.target.value);
        break;

      case "login-password":
        setPassword(e.target.value);
        break;

        case "newPassword":
          setNewPassword(e.target.value);
          break;

          case "passwordCode":
            setCode(e.target.value);
            break;

      default:
        break;
    }
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setNewPassword("");
    setOpenDialog(false);
  };

  const handleUsernameClickOpen = () => {
    setOpenUsernameDialog(true);
  };

  const handleUsernameClose = () => {
    setUsername("");
    setOpenUsernameDialog(false);
  };

  const onUsernameSubmit = (e) => {
    e.preventDefault();
    Auth.forgotPassword(username)
      .then((data) => {
        setOpenUsernameDialog(false);
        handleClickOpen();
      })
      .catch((err) => {
        showErrorHandler(err.message);
      });
  };

  const onNewPasswordSubmit = (e) => {
    e.preventDefault();
    Auth.forgotPasswordSubmit(username, code, newPassword)
      .then()
      .catch((err) => {
        showErrorHandler(err.message);
      });
    setNewPassword("");
    setCode("");
    setOpenDialog(false);
  };

  const showErrorHandler = (message) => {
    setErrorMessage((prevErrorMessage) => message);
    setErrorMessageOpen((prevErrorMessageOpen) => true);
    setTimeout(() => {
      setErrorMessage((prevErrorMessage) => "");
      setErrorMessageOpen((prevErrorMessageOpen) => false);
    }, [3000]);
  };

  return (
    <div>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item lg={4} sm={6} xs={10}>
          <Paper className={classes.paper}>
            <form id="loginForm" onSubmit={submitHandler}>
              <LockIcon color="primary" fontSize="large" />
              <div className={classes.inputs}>
                <TextField
                  id="login-username"
                  label="Username"
                  type="text"
                  value={username}
                  onChange={onChangeHandler}
                />
              </div>
              <div className={classes.inputs}>
                <TextField
                  id="login-password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={onChangeHandler}
                />
              </div>
              <div className={classes.inputs}>
                <Button
                  color="primary"
                  type="submit"
                  id="submitButton"
                  size="large"
                >
                  LOGIN
                </Button>
              </div>
            </form>
          </Paper>
          <div className={classes.forgot}>
            <Button
              size="small"
              color="primary"
              onClick={handleUsernameClickOpen}
            >
              Forgot Password?
            </Button>
          </div>
        </Grid>
      </Grid>

      <Dialog
        open={openUsernameDialog}
        onClose={handleUsernameClose}
        aria-labelledby="username-dialog-title"
      >
        <DialogTitle id="send-username-dialog-title">
          Enter username
        </DialogTitle>
        <DialogContent>
          <div className={classes.inputs}>
            <TextField
              autoFocus
              margin="dense"
              id="send-username"
              label="Username"
              type="text"
              value={username}
              onChange={onChangeHandler}
              fullWidth
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUsernameClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onUsernameSubmit} color="primary">
            Send Code
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="reset-pass-dialog-title">
          Enter new password
        </DialogTitle>
        <DialogContent>
          <div className={classes.inputs}>
            <TextField
              autoFocus
              margin="dense"
              id="newPassword"
              label="New Password"
              type="password"
              value={newPassword}
              onChange={onChangeHandler}
              fullWidth
            />
          </div>

          <div className={classes.inputs}>
            <TextField
              autoFocus
              margin="dense"
              id="passwordCode"
              label="Code"
              type="text"
              value={code}
              onChange={onChangeHandler}
              fullWidth
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onNewPasswordSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Message message={errorMessage} type="error" open={errorMessageOpen} />
    </div>
  );
};

export default Login;
