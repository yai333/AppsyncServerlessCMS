const AWSConfig = {
  amp: {
    region: "ap-southeast-2",
    identityPoolId: "ap-southeast-2:52748bd4-ac2d-48b1-aa68-e0f903ce2f9a",
    userPoolId: "ap-southeast-2_3rWSMnT1B",
    userPoolWebClientId: "khq752jucs1mlfacbgr9k1v6u",
    mandatorySignIn: false
  },
  appSync: {
    url:
      "https://mbjshv5ixzhlfmhfi56jarfzxu.appsync-api.ap-southeast-2.amazonaws.com/graphql",
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
