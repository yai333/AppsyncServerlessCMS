"use strict";
const AWS = require("aws-sdk");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_URL,
    port: "3306",
    dialect: "mysql",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  }
);

sequelize
  .authenticate()
  .then(function() {
    console.log("DATABASE CONNECTED! ");
  })
  .catch(err => {
    console.log(err);
  })
  .done();

const Posts = sequelize.define(
  "posts",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING
    },
    author_id: {
      type: Sequelize.STRING
    },
    content: {
      type: Sequelize.STRING
    }
  },
  {
    freezeTableName: true,
    tableName: "posts"
  }
);

Posts.sync();

module.exports.graphqlHandler = async (event, context, callback) => {
  const { field, arguments: args } = event;

  switch (field) {
    case "getPosts":
      const posts = await Posts.findAll({
        raw: true
      });

      callback(null, posts);
      break;
    case "addPost":
      //get user sub(id)
      const userid = event.identity.cognitoIdentityAuthProvider.match(
        /CognitoSignIn:(.*?)"/
      )[1];
      const {
        arguments: { content, created_at, notificationEmails, title }
      } = event;
      try {
        const post = await Posts.create({ title, content, author_id: userid });
        callback(null, post.get({ plain: true }));
      } catch (err) {
        callback(err, null);
      }
      break;
    case "sendNotification":
      //send notification
      const { payload } = event;
      callback(null, payload);
    case "deletePost":
      //send notification
      const {
        arguments: { id }
      } = event;

      const rowDeleted = await Posts.destroy({
        where: {
          id
        }
      });
      rowDeleted >= 1
        ? callback(null, { id })
        : callback(`Deleted failed`, null);
    default: {
      callback(`Unknown function received, unable to resolve ${field}`, null);
      break;
    }
  }
};
