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
    allowedValues: ['2016 Spring', '2016 Fall', '2017 Spring', '2017 Fall', '2018 Spring', '2018 Fall', '2019 Spring', '2019 Fall', '2020 Spring', '2020 Fall', '2021 Spring'],
    defaultValue: '2020 Fall',
  },
  name: {
    type: String,
    allowedValues: ['ICS 101', 'ICS 102', 'ICS 110', 'ICS 111', 'ICS 141', 'ICS 210',
      'ICS 211', 'ICS 212', 'ICS 215', 'ICS 235', 'ICS 241', 'ICS 311', 'ICS 312',
      'ICS 313', 'ICS 314', 'ICS 321', 'ICS 331', 'ICS 332', 'ICS 351', 'ICS 355',
      'ICS 361', 'ICS 390', 'ICS 414', 'ICS 415', 'ICS 419', 'ICS 421', 'ICS 422',
      'ICS 423', 'ICS 424', 'ICS 425', 'ICS 426', 'ICS 428', 'ICS 431', 'ICS 432',
      'ICS 435', 'ICS 441', 'ICS 442', 'ICS 443', 'ICS 451', 'ICS 452', 'ICS 455',
      'ICS 461', 'ICS 462', 'ICS 464', 'ICS 465', 'ICS 466', 'ICS 469', 'ICS 471',
      'ICS 475', 'ICS 476', 'ICS 481', 'ICS 483', 'ICS 484', 'ICS 485', 'ICS 491',
      'ICS 495', 'ICS 499'],
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
            <Header as="h2" textAlign="center" inverted>Add Course</Header>
            <AutoForm ref={ref => {
              fRef = ref;
            }} schema={bridge} onSubmit={data => this.submit(data, fRef)}>
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
