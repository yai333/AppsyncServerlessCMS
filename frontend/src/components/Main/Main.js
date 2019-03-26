import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Auth, Hub } from "aws-amplify";
import Posts from "pages/Posts";
import Login from "pages/Login";

const history = createBrowserHistory();

export default class Main extends Component {
  constructor(props) {
    super(props);
    Hub.listen("auth", this, "main");
    this.state = { user: null };
  }

  componentDidMount() {
    this.loadUser();
  }

  loadUser = () => {
    Auth.currentAuthenticatedUser()
      .then(user => this.setState({ user: user }))
      .catch(err => this.setState({ user: null }));
  };

  onHubCapsule(capsule) {
    const { channel, payload } = capsule;
    if (channel === "auth" && payload.event === "signIn") {
      this.loadUser();
    }
  }

  render() {
    const { user } = this.state;
    return (
      <React.Fragment>
        <Router history={history}>
          <Switch>
            <Route exact path="/" render={props => <Posts user={user} />} />
            <Route
              exact
              path="/login"
              render={props => <Login user={user} />}
            />
          </Switch>
        </Router>
      </React.Fragment>
    );
  }
}
