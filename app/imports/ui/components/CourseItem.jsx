import React from 'react';
import { Button, Icon, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

/** Renders a single row in Transcript table. See pages/Transcript.jsx. */
class CourseItem extends React.Component {
  render() {
    return (
        <Table.Row>
          <Table.Cell>{this.props.course.semester}</Table.Cell>
          <Table.Cell>{this.props.course.name}</Table.Cell>
          <Table.Cell>{this.props.course.credits}</Table.Cell>
          <Table.Cell>{this.props.course.status}</Table.Cell>
          <Table.Cell>{this.props.course.grade}</Table.Cell>
          <Table.Cell>
            <Link to={`/edit/${this.props.course._id}`}>Edit</Link>
          </Table.Cell>
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
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(CourseItem);
