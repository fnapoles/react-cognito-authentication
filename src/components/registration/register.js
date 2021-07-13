import { useState } from "react";
import classes from "./register.module.scss";
import { Auth } from "aws-amplify";
import Message from "../ui/Message";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import LockIcon from "@material-ui/icons/Lock";
import Typography from "@material-ui/core/Typography";

const Registration = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageOpen, setErrorMessageOpen] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    Auth.signUp({
      username,
      password,
      attributes: {
        email,
        phone_number: phone,
      },
    })
      .then(user => {
        setUsername("");
        setPassword("");
        setEmail("");
        setPhone("");
        props.onRegistration(true);
      })
      .catch((err) => {
        props.onRegistration();
        showErrorHandler(err.message);
      });
  };

  const onChangeHandler = (e) => {
    switch (e.target.id) {
      case "register-username":
        setUsername(e.target.value);
        break;

      case "register-password":
        setPassword(e.target.value);
        break;

      case "register-email":
        setEmail(e.target.value);
        break;

      case "register-phone":
        setPhone(e.target.value);
        break;

      default:
        break;
    }
  };

  const showErrorHandler = (message) => {
    setErrorMessage((prevErrorMessage) => message);
    setErrorMessageOpen((prevErrorMessageOpen) => true);
    setTimeout(() => {
      setErrorMessage((prevErrorMessage) => "");
      setErrorMessageOpen((prevErrorMessageOpen) => false);
    }, [3000]);
  };

  const fieldParams = [
    {
      id: "register-username",
      label: "Username",
      type: "text",
      value: username,
    },
    {
      id: "register-password",
      label: "Password",
      type: "password",
      value: password,
    },
    {
      id: "register-email",
      label: "Email",
      type: "email",
      value: email,
    },
    {
      id: "register-phone",
      label: "Phone",
      type: "text",
      value: phone,
    },
  ];

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Grid item lg={4} sm={6} xs={10}>
        <Paper className={classes.paper}>
          <form id="registrationForm" onSubmit={submitHandler}>
            <LockIcon color="primary" fontSize="large" />
            {fieldParams.map((field) => {
              return (
                <div key={`div-${field.id}`} className={classes.inputs}>
                  <TextField
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    type={field.type}
                    value={field.value}
                    onChange={onChangeHandler}
                  />
                </div>
              );
            })}
            <Typography
              variant="caption"
              display="initial"
              gutterBottom
            >
              Format: +12345678910
            </Typography>
            <div className={classes.inputs}>
              <Button
                color="primary"
                type="submit"
                id="registrationSubmitButton"
                size="large"
              >
                REGISTER
              </Button>
            </div>
          </form>
        </Paper>
      </Grid>

      <Message message={errorMessage} type="error" open={errorMessageOpen} />
    </Grid>
  );
};

export default Registration;
