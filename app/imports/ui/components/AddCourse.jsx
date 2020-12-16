import React from 'react';
import { Grid, Segment, Header, Button } from 'semantic-ui-react';
import { AutoForm, ErrorsField, SelectField, SubmitField, NumField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Courses } from '../../api/course/Course';

/** Create a schema to specify the structure of the data to appear in the form. */
const formSchema = new SimpleSchema({
  semester: {
    type: Number,
    allowedValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    defaultValue: 7,
  },
  num: {
    type: Number,
  },
  credits: {
    type: Number,
    allowedValues: [1, 2, 3, 4],
    defaultValue: 3,

  },
  status: {
    type: String,
    allowedValues: ['Completed', 'Upcoming'],
    defaultValue: 'Upcoming',
  },
  // grade: {
  //   type: String,
  //   allowedValues: ['TBD', 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F', 'W'],
  //   defaultValue: 'TBD',
  // },
});

const bridge = new SimpleSchema2Bridge(formSchema);

/** Renders the Page for adding a document. */
class AddCourse extends React.Component {

  d = new Date();

  /** On submit, insert the data. */
  submit(data, formRef) {
    const { semester, num, credits, status, grade } = data;
    const owner = Meteor.user().username;
    Courses.collection.insert({ semester, num, credits, status, grade, owner },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            swal('Success', 'Course added successfully', 'success');
            formRef.reset();
          }
        });
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    let fRef = null;
    return (
        <Grid container centered id="AddCourse">
          <Grid.Column>
            <Header as="h2" textAlign="center" inverted>
              Add Course
              <Button floated='right' as='a' href="#transcript">
                Return to Top
              </Button>
            </Header>
            <AutoForm ref={ref => {
              fRef = ref;
            }} schema={bridge} onSubmit={data => this.submit(data, fRef)}>
              <Segment>
                <SelectField id='semester' name='semester'/>
                <NumField id='num' name='num'/>
                <SelectField id='credits' name='credits'/>
                <SelectField id='status' name='status'/>
                {/* <SelectField id='grade' name='grade'/> */}
                <SubmitField id='submit' value='Submit'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

export default AddCourse;
