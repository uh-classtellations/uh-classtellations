import React from 'react';
import _ from 'lodash';
import { Meteor } from 'meteor/meteor';
import { Container, Table, Header, Loader, Button } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Courses } from '../../api/course/Course';
import CourseItem from '../components/CourseItem';
import AddCourse from '../components/AddCourse';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class Transcript extends React.Component {

  coursesSorted = [];

  /** If the subscription(s) have been received, sort collection, and render the page, otherwise show a loading icon. */
  render() {
    this.coursesSorted = _.reverse(_.sortBy(_.reverse(_.sortBy(this.props.courses, ['courses', 'name'])), ['course', 'semester']));

    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    return (
        <div className="landing-background">
        <Container>
          <Header as="h1" textAlign="center" inverted>
            Transcript
            <Button floated='right'>
              Add Course
            </Button>
          </Header>
          <Table sortable celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Semester</Table.HeaderCell>
                <Table.HeaderCell>Course</Table.HeaderCell>
                <Table.HeaderCell>Credits</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Grade</Table.HeaderCell>
                <Table.HeaderCell>Delete</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.coursesSorted.map((course) => <CourseItem key={course._id} course={course} Courses={Courses}/>)}
            </Table.Body>
          </Table>
          <AddCourse/>
        </Container>
        </div>
    );
  }
}

/** Require an array of Stuff documents in the props. */
Transcript.propTypes = {
  courses: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe(Courses.userPublicationName);
  return {
    courses: Courses.collection.find({}).fetch(),
    ready: subscription.ready(),
  };
})(Transcript);
