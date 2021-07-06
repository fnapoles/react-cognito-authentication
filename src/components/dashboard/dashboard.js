import { Fragment } from "react";
import Navbar from "../navbar/Navbar";

const Dashboard = (props) => {
  return (
    <Fragment>
      <Navbar onLogout={props.onLogout} />
    </Fragment>
  );
};

export default Dashboard;
