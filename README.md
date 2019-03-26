# Serverless CMS

Concept proof prototype of serverless CMS using AWS Appsync, Aurora Serverless, Cognito, Serverless Framework and React

## Stack

- Serverless Framework
- AWS Appsync
- AWS Cognito
- AWS Aurora Serverless
- AWS Lambda
- React

File Structure

- /nodejs - Backend
- /Frontend - React frontend

## Deploy backend appsync api

- Change admin email, database name, database username database user password in nodejs/serverless.yml
  eg.
  ``` 
custom:
  poolName: ${self:provider.stage}SimpleCMS
  dbName: "simpleCMS"
  dbUserName: "root"
  dbPassword: "Password"
  systemUserEmail: "dev@neami.app"

  ```
- Set up AWS credentials
  ```aws configure```
- Install Serverless framework
  ```npm install -g serverless```
- Deploy
  ```sls deploy --stage dev```

## How to Run App

- Setup Appsync endpoints and AWS config in `front/src/config/config.js`, replace YOUR_IDENTITY_POOLID, YOUR_COGNITO_POOLID, YOUR_COGNITO_POOLID_CLIENTID to related values

```
const AWSConfig = {
  amp: {
    region: "ap-southeast-2",
    identityPoolId: "YOUR_IDENTITY_POOLID",
    userPoolId: "YOUR_COGNITO_POOLID",
    userPoolWebClientId: "YOUR_COGNITO_POOLID_CLIENTID",
    mandatorySignIn: false
  },
  appSync: {
    url: "YOUR_APPSYNC_ENDPOINT",
    region: "ap-southeast-2"
  }
};
```

- Install dependencies
  ```npm install```

- Run app
  ```npm start```

- Build app
  ```npm run build```

- Deploy to AWS S3 bucket
  ```aws s3 cp build s3://YOUR_BUCKET_NAME```
