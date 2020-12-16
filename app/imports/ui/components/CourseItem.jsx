import React from 'react';
import { Button, Icon, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const populateSemNames = (firstYear, numSems) => {
  let year = firstYear;
  let isFall = true;
  const result = new Array(numSems);
  for (let i = 0; i < numSems; i++) {
    if (isFall) {
      result[i] = `Fall ${year}`;
      isFall = false;
      year++;
    } else {
      result[i] = `Spring ${year}`;
      isFall = true;
    }
  }
  return result;
};

/** Renders a single row in Transcript table. See pages/Transcript.jsx. */
class CourseItem extends React.Component {
  semNames = populateSemNames(2018, 9);

  progressColors(status) {
    if (status === 'Complete') {
      return 'positive';
    } return status === 'In Progress' ? 'warning' : 'negative';
  }

  removeItem(docID) {
    console.log(`item to delete is ${docID}`);
    this.props.Courses.collection.remove(docID);
  }

  render() {
    return (
        <Table.Row className={this.progressColors(this.props.course.status)}>
          <Table.Cell>{this.semNames[this.props.course.semester]}</Table.Cell>
          <Table.Cell>{`ICS ${this.props.course.num}`}</Table.Cell>
          <Table.Cell>{this.props.course.credits}</Table.Cell>
          <Table.Cell>{this.props.course.status}</Table.Cell>
          <Table.Cell>{this.props.course.grade}</Table.Cell>
          <Table.Cell>
            <Button icon onClick={() => this.removeItem(this.props.course._id)}>
              <Icon name='trash'/>
            </Button>
          </Table.Cell>
        </Table.Row>
    );
  }
}

/** Require a document to be passed to this component. */
CourseItem.propTypes = {
  course: PropTypes.object.isRequired,
  Courses: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(CourseItem);
