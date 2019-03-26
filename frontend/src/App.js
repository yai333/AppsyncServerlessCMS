import React, { Component } from "react";
import gql from "graphql-tag";
import Amplify, { Auth, Hub } from "aws-amplify";
import AWSAppSyncClient, {
  createAppSyncLink,
  createLinkWithCache
} from "aws-appsync";
import { AUTH_TYPE } from "aws-appsync/lib";
import { ApolloProvider } from "react-apollo";
import { ApolloLink } from "apollo-link";
import { withClientState } from "apollo-link-state";
import { Rehydrated } from "aws-appsync-react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import blueGrey from "@material-ui/core/colors/blueGrey";
import orange from "@material-ui/core/colors/orange";
import Main from "components/Main/Main";
import "assets/css/react.css";

import { AWSConfig } from "./config/Config";

//window.LOG_LEVEL = "DEBUG";
const THEME = createMuiTheme({
  palette: {
    primary: { light: blueGrey[50], main: blueGrey[400], dark: blueGrey[700] },
    secondary: orange
  },
  typography: {
    useNextVariants: true,
    suppressDeprecationWarnings: true
  }
});

Amplify.configure({
  Auth: AWSConfig.amp
});

const stateLink = createLinkWithCache(cache =>
  withClientState({
    cache,
    resolvers: {
      Mutation: {
        updateMyAccount: (_, { userid, name, email }, { cache }) => {
          const data = {
            myAccount: {
              userid,
              name,
              email,
              __typename: "myAccount"
            }
          };
          cache.writeData({ data });
          return null;
        }
      }
    }
  })
);

const clientLink = createAppSyncLink({
  ...AWSConfig.appSync,
  auth: {
    type: AUTH_TYPE.AWS_IAM,
    credentials: () => Auth.currentCredentials()
  }
});

const link = ApolloLink.from([stateLink, clientLink]);
const client = new AWSAppSyncClient({}, { link });

export default class App extends Component {
  constructor(props) {
    super(props);

    Hub.listen("auth", this, "main");
  }
  onHubCapsule(capsule) {
    const { channel, payload } = capsule;

    if (channel === "auth" && payload.event === "signIn") {
      // Auth.currentUserInfo().then(authInfo => {
      //   if (!authInfo || !authInfo.attributes) {
      //     return;
      //   }
      //   const {
      //     attributes: { sub: userid, name, email }
      //   } = authInfo;
      //
      //   name &&
      //     client
      //       .mutate({
      //         variables: { userid, name, email },
      //         mutation: gql`
      //           mutation updateMyAccount(
      //             $userid: ID!
      //             $name: String
      //             $email: String
      //           ) {
      //             updateMyAccount(userid: $userid, name: $name, email: $email)
      //               @client {
      //               userid
      //               name
      //               email
      //             }
      //           }
      //         `
      //       })
      //       .then(result => {})
      //       .catch(error => {});
      // });
    }
  }

  render() {
    if (!client) {
      return <div />;
    }
    return (
      <ApolloProvider client={client}>
        <Rehydrated>
          <MuiThemeProvider theme={THEME}>
            <Main />
          </MuiThemeProvider>
        </Rehydrated>
      </ApolloProvider>
    );
  }
}
