import withStyles from "@material-ui/core/styles/withStyles";
import React from "react";
import PropTypes from "prop-types";

const uhoh = require("assets/img/uhoh.png");

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper
  }
});

const NoDataFound = props => {
  return (
    <div style={{ display: "flex", width: "100%" }}>
      <img src={uhoh} alt="data not found" />
    </div>
  );
};

NoDataFound.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(NoDataFound);
