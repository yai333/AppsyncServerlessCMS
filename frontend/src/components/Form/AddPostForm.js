import React from "react";
import PropTypes from "prop-types";
import Form from "react-jsonschema-form";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AddPostModalStyle from "assets/components/AddPostModal";
import { AddPostFomSchema } from "config/Config";

const { uiSchema, schema } = AddPostFomSchema;

const AddPostForm = ({ classes, onFormSubmited }) => {
  return (
    <div className={classes.main}>
      <Form schema={schema} uiSchema={uiSchema} onSubmit={onFormSubmited}>
        <div className={classes.footer}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className={classes.button}
          >
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};

AddPostForm.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  onFormSubmited: PropTypes.func.isRequired
};

export default withStyles(AddPostModalStyle, { withTheme: true })(AddPostForm);
