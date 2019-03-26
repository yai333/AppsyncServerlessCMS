import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const loading = require("assets/img/loading.gif");
const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2
  },
  content: {
    display: "flex",
    width: "100%",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.unit * 2
  }
});

function CircularIndeterminate(props) {
  const { classes } = props;
  return (
    <div className={classes.content}>
      <img src={loading} alt="loading" width={props.width} />
    </div>
  );
}

CircularIndeterminate.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired
};

export default withStyles(styles)(CircularIndeterminate);
