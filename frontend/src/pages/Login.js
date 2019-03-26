import React, { useState } from "react";
import { Authenticator, SignUp, ConfirmSignUp } from "aws-amplify-react";
import { Redirect } from "react-router-dom";

const Login = ({ user }) => {
  const [redirect, setRedirect] = useState(false);
  const handleStateChange = auth_state => {
    auth_state === "signedIn" && setRedirect(true);
  };
  return user || redirect ? (
    <Redirect to="/" />
  ) : (
    <Authenticator
      onStateChange={handleStateChange}
      hide={[SignUp, ConfirmSignUp]}
      authState="signIn"
    />
  );
};
export default Login;
