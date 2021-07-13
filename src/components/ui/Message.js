import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const Message = (props) => {
  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={props.open}
        autoHideDuration={3000}
      >
        <Alert severity={props.type}>{props.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default Message;
