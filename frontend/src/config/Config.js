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

const AddPostFomSchema = {
  uiSchema: {
    form: {
      content: {
        "ui:widget": "textarea",
        "ui:options": {
          rows: 10
        }
      },
      notificationEmails: {
        "ui:help": "Separate email addresses with a comma"
      }
    }
  },
  schema: {
    title: "",
    description: "",
    type: "object",
    properties: {
      form: {
        title: "Add Post",
        type: "object",
        required: ["title", "content"],
        properties: {
          title: {
            title: "Title",
            type: "string"
          },
          content: {
            type: "string",
            title: "Content"
          },
          notificationEmails: {
            type: "string",
            title: "Notification Emails"
          }
        }
      }
    }
  }
};

export { AWSConfig, AddPostFomSchema };
