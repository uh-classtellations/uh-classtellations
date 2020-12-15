import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd';

/** Renders a single row in Transcript table. See pages/Transcript.jsx. */
class ProgCourse extends React.Component {

  render() {
    return (
        <Draggable className='prog-course'>
          ICS {this.props.course.num}
        </Draggable>
    );
  }
}

/** Require a document to be passed to this component. */
ProgCourse.propTypes = {
  course: PropTypes.object.isRequired,
  Courses: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(ProgCourse);
