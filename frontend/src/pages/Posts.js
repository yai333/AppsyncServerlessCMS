import React, { useState, useEffect } from "react";
import { compose, graphql, withApollo } from "react-apollo";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import Modal from "react-modal";
import { format } from "date-fns";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import AddAlert from "@material-ui/icons/AddAlert";
import CardActions from "@material-ui/core/CardActions";
import DeleteSharpIcon from "@material-ui/icons/DeleteSharp";
import Snackbar from "components/Snackbar/Snackbar";
import Navigator from "components/Navigator/Navigator";
import AddPostForm from "components/Form/AddPostForm";
import NoDataFound from "components/NoDataFound/NoDataFound";
import CircularIndeterminate from "components/CircularProgress/CircularIndeterminate";
import QueryPosts from "Graphql/QueryPosts";
import MutationDeletePost from "Graphql/MutationDeletePost";
import MutationAddPost from "Graphql/MutationAddPost";
import SubscribeToAddPost from "Graphql/SubscribeToAddPost";
import SubscribeToDeletePost from "Graphql/SubscribeToDeletePost";
import CardStyle from "assets/components/CardStyle";
import { FabButton } from "assets/components/Button";
import FooterStyle from "assets/components/FooterStyle";

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    paddingTop: 10
  },
  ...CardStyle,
  ...FabButton,
  ...FooterStyle
});
const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  }
};

const CustomSnackBar = ({
  isConfigForm,
  closeNotification,
  title,
  openSnackbar
}) => {
  return (
    <Snackbar
      place="tc"
      color="success"
      icon={AddAlert}
      message={`${title} saved successfully!`}
      open={openSnackbar}
      closeNotification={closeNotification}
      close
    />
  );
};

CustomSnackBar.propTypes = {
  isConfigForm: PropTypes.bool,
  closeNotification: PropTypes.func,
  openSnackbar: PropTypes.bool,
  title: PropTypes.string
};

const PostList = ({ posts, classes, user, deletePost }) => {
  return posts.map((post, index) => {
    const { title, content, createdAt, id } = post;
    const post_date = format(createdAt, "DD/MM/YYYY HH:mm", { locale: "au" });
    return (
      <Card className={classes.card} key={`post-${index}`}>
        <CardHeader title={title} subheader={post_date} />
        <CardContent>
          <Typography component="p">{content}</Typography>
        </CardContent>
        {user && (
          <CardActions className={classes.actions} disableActionSpacing>
            <IconButton />
            <IconButton />
            <IconButton
              aria-label="Delete Post"
              style={{ marginLeft: "auto" }}
              onClick={() => deletePost(id)}
            >
              <DeleteSharpIcon />
            </IconButton>
          </CardActions>
        )}
      </Card>
    );
  });
};

PostList.propTypes = {
  posts: PropTypes.array,
  classes: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired
};

const Posts = ({
  classes,
  loading,
  error,
  posts,
  user,
  addPost,
  history,
  deletePost,
  subscribeToAddPost,
  subscribeToDeletePost
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [snackbarVisibility, setSnackbarVisibility] = useState(false);

  useEffect(() => {
    subscribeToAddPost();
    subscribeToDeletePost();
  }, []);

  const openModal = () => {
    !user && history.push("/login");
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  const closeSnackbar = () => {
    setSnackbarVisibility(false);
  };

  const onFormSubmited = formValues => {
    const { formData } = formValues;

    if (formData && formData.form) {
      addPost(formData.form).then(() => {
        setSnackbarVisibility(true);
      });
      setModalIsOpen(false);
    }
  };

  const onDeleteButtonPressed = async id => {
    await deletePost(id);
  };

  if (loading) {
    return <CircularIndeterminate width={"250px"} />;
  }

  if (error && !posts) {
    return <NoDataFound title={"App Loding failed."} />;
  }

  return (
    <React.Fragment>
      <CustomSnackBar
        title={"Your content was added successfully"}
        closeNotification={closeSnackbar}
        openSnackbar={snackbarVisibility}
      />
      {user && <Navigator />}
      <Paper className={classes.root}>
        <PostList
          posts={posts}
          classes={classes}
          user={user}
          deletePost={onDeleteButtonPressed}
        />
      </Paper>
      {user && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customModalStyles}
          ariaHideApp={false}
          contentLabel="Example Modal"
        >
          <AddPostForm onFormSubmited={onFormSubmited} />
        </Modal>
      )}
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Fab
          color="secondary"
          size="large"
          aria-label="Add"
          className={classes.fabButton}
          onClick={openModal}
        >
          <AddIcon />
        </Fab>
      </AppBar>
    </React.Fragment>
  );
};

Posts.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired,
  addPost: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.object,
  posts: PropTypes.array
};

export default withApollo(
  compose(
    graphql(QueryPosts, {
      options: () => {
        return {
          fetchPolicy: "cache-and-network"
        };
      },
      props: ({
        data: { getPosts: posts, error, loading, subscribeToMore }
      }) => {
        return {
          posts,
          error,
          loading,
          subscribeToAddPost: () => {
            return subscribeToMore({
              document: SubscribeToAddPost,
              variables: {},
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const {
                  data: { onPostAdded }
                } = subscriptionData;
                const { getPosts: posts } = prev;

                if (posts.findIndex(post => post.id === onPostAdded.id) < 0)
                  return Object.assign({}, prev, {
                    getPosts: [onPostAdded, ...posts]
                  });
              },
              onError: err => {
                return console.error(err);
              }
            });
          },
          subscribeToDeletePost: () => {
            return subscribeToMore({
              document: SubscribeToDeletePost,
              variables: {},
              updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;
                const {
                  data: { onPostDeleted }
                } = subscriptionData;
                const { getPosts: posts } = prev;
                if (
                  posts.findIndex(post => post.id === onPostDeleted.id) >= 0
                ) {
                  const newPosts = posts.filter(
                    post => post && post.id !== onPostDeleted.id
                  );

                  return Object.assign({}, prev, {
                    getPosts: newPosts
                  });
                }
              },
              onError: err => {
                return console.error(err);
              }
            });
          }
        };
      }
    }),
    graphql(MutationAddPost, {
      props: props => ({
        addPost: post => {
          return props.mutate({
            variables: {
              post
            },
            update: (proxy, { data: { addPost } }) => {
              const query = QueryPosts;
              const { getPosts: posts = [] } = proxy.readQuery({
                query,
                variables: {}
              });

              const new_posts = posts.filter(
                post => post && post.id !== addPost.id
              );

              proxy.writeQuery({
                query,
                data: {
                  getPosts: [addPost, ...new_posts]
                }
              });
            },
            optimisticResponse: ({ adminId, username }) => {
              return {
                addPost: {
                  id: "99999999999",
                  __typename: "Post",
                  ...post,
                  createdAt: new Date(),
                  notificationEmails: "NA"
                }
              };
            }
          });
        }
      })
    }),
    graphql(MutationDeletePost, {
      props: props => ({
        deletePost: id => {
          return props.mutate({
            variables: {
              id
            },
            update: (proxy, { data: { deletePost } }) => {
              const query = QueryPosts;
              const { getPosts: posts = [] } = proxy.readQuery({
                query,
                variables: {}
              });

              const new_posts = posts.filter(
                post => post && post.id !== deletePost.id
              );

              proxy.writeQuery({
                query,
                data: {
                  getPosts: new_posts
                }
              });
            },
            optimisticResponse: ({ id }) => {
              console.log(id);
              return {
                deletePost: {
                  id,
                  __typename: "Post",
                  title: "DELETE",
                  content: "deleted content",
                  createdAt: new Date(),
                  notificationEmails: "NA"
                }
              };
            }
          });
        }
      })
    })
  )(withStyles(styles, { withTheme: true })(withRouter(Posts)))
);
