import React, { Component } from "react";
import { Auth, Hub } from "aws-amplify";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import NavigatorStyle from "assets/components/Navigator";

class Navigator extends Component {
  constructor(props) {
    super(props);

    this.loadUser = this.loadUser.bind(this);

    Hub.listen("auth", this, "navigator");
    this.state = { user: null };
  }

  componentDidMount() {
    this.loadUser();
  }

  onHubCapsule(capsule) {
    const { channel, payload } = capsule;
    if (channel === "auth" && payload.event === "signIn") {
      this.loadUser();
    }
  }

  signout = () => {
    Auth.signOut({ global: true })
      .then(data => window.location.reload())
      .catch(err => console.log(err));
  };

  loadUser() {
    Auth.currentAuthenticatedUser()
      .then(user => this.setState({ user: user }))
      .catch(err => this.setState({ user: null }));
  }

  render() {
    const { user } = this.state;
    const { classes } = this.props;

    return (
      <AppBar position="static" color="primary">
        <Toolbar>
          {user && (
            <React.Fragment>
              <Typography
                variant="inherit"
                color="inherit"
                className={classes.grow}
              >
                {user && "Hi " + user.username}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={this.signout}
              >
                SignOut
              </Button>
            </React.Fragment>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

Navigator.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(NavigatorStyle)(Navigator);
