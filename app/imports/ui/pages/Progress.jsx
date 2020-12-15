// Drag and drop made referencing https://codesandbox.io/s/ql08j35j3q?file=/index.js:2606-2614

import React, { useState } from 'react';
import { Container } from 'semantic-ui-react';
import Board, { moveCard } from '@lourenci/react-kanban';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import ProgCourse from '../components/ProgCourse';

import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Courses } from '../../api/course/Course';

class Progress extends React.Component {

  render() {
    return (
        <div className='landing-background'>
          {this.props.courses.map((course) => <ProgCourse key={course._id} course={course} Courses={Courses}/>)}
        </div>
    );
  }
}

Progress.propTypes = {
  courses: PropTypes.array.isRequired,
  Courses: PropTypes.object.isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe(Courses.userPublicationName);
  return {
    courses: Courses.collection.find({}).fetch(),
    ready: subscription.ready(),
  };
})(Progress);
