import React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import { AutoForm, ErrorsField, SelectField, SubmitField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Courses } from '../../api/course/Course';

/** Create a schema to specify the structure of the data to appear in the form. */
const formSchema = new SimpleSchema({
  semester: {
    type: String,
    allowedValues: ['Spring 2018', 'Fall 2018', 'Spring 2019', 'Fall 2019', 'Spring 2020', 'Fall 2020'],
    defaultValue: 'Fall 2020',
  },
  name: {
    type: String,
    allowedValues: ['ICS 111', 'ICS 141', 'ICS 211', 'ICS 212', 'ICS 241', 'ICS 311', 'ICS 314', 'ICS 321'],
    defaultValue: 'ICS 111',
  },
  credits: {
    type: Number,
    allowedValues: [1, 2, 3, 4],
    defaultValue: '3',
  },
  status: {
    type: String,
    allowedValues: ['In Progress', 'Complete', 'Withdrew'],
    defaultValue: 'In Progress',
  },
  grade: {
    type: String,
    allowedValues: ['TBD', 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F', 'W'],
    defaultValue: 'TBD',
  },
  // prerequisites: [],
});

const bridge = new SimpleSchema2Bridge(formSchema);

/** Renders the Page for adding a document. */
class AddCourse extends React.Component {

  /** On submit, insert the data. */
  submit(data, formRef) {
    const { semester, name, credits, status, grade } = data;
    const owner = Meteor.user().username;
    Courses.collection.insert({ semester, name, credits, status, grade, owner },
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
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Add Course</Header>
            <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => this.submit(data, fRef)} >
              <Segment>
                <SelectField name='semester'/>
                <SelectField name='name'/>
                <SelectField name='credits'/>
                <SelectField name='status'/>
                <SelectField name='grade'/>
                <SubmitField value='Submit'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

export default AddCourse;
