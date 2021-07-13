import { Fragment } from "react";
import Navbar from "../navbar/Navbar";

const Dashboard = (props) => {
  return (
    <Fragment>
      <Navbar onLogout={props.onLogout} />
      <div>Username: <i>{props.user.username}</i></div>
      <div>Email: <i>{props.user.attributes.email}</i></div>
      <div>Phone: <i>{props.user.attributes.phone_number}</i></div>
    </Fragment>
  );
};

export default Dashboard;
