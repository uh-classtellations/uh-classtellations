// Drag and drop made referencing https://codesandbox.io/s/ql08j35j3q?file=/index.js:2606-2614

import React from 'react';
import { Grid } from 'semantic-ui-react';
import jsPDF from 'jspdf';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';

import Xarrow from 'react-xarrows';

import swal from 'sweetalert';

import { Courses } from '../../api/course/Course';

import { View } from 'react-native';

const grid = 5;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  background: 'rgba(250, 250, 250, 0.7)',
  borderRadius: 3,
  width: 80,
  height: 40,

  // change background colour if dragging
  // background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'rgba(175, 215, 250, 0.5)' : 'rgba(250, 250, 250, 0.2)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  padding: grid,
  width: 90,
  height: 900,
});

const emptySems = (numSems) => {
  const result = new Array(numSems);
  for (let i = 0; i < numSems; i++) {
    result[i] = [];
  }
  return result;
};

const populateSemNames = (firstYear, numSems) => {
  let year = firstYear;
  let isFall = true;
  const result = new Array(numSems);
  for (let i = 0; i < numSems; i++) {
    if (isFall) {
      result[i] = `${year} Fall`;
      isFall = false;
      year++;
    } else {
      result[i] = `${year} Spring`;
      isFall = true;
    }
  }
  console.log(result);
  return result;
};

class Progress extends React.Component {

  constructor() {
    super();

    this.numSems = 10;

    this.firstYear = 2018;

    this.semNames = populateSemNames(this.firstYear, this.numSems);
    console.log(this.semNames[5]);

    this.userId = Meteor.userId();

    this.semesters = emptySems(this.numSems);

    this.keyToId = new Map();

    this.owner = null;

    this.preqs = [
      [111, 211],
      [141, 241],
      [211, 212],
      [211, 311],
      [241, 311],
    ];
  }

  keyForSemAndNum = (sem, num) => (`${sem}-${num}`);

  refreshSemsAndIds = () => {
    while (this.semesters.length > 0) this.semesters.pop();
    while (this.keyToId.length > 0) this.ids.pop();
    this.semesters = emptySems(this.numSems);
    this.props.courses.map((course) => {
      this.semesters[course.semester].push(course.num);
      this.keyToId.set(
          this.keyForSemAndNum(course.semester, course.num),
          course._id);
    });
    console.log(this.semesters);
    this.semesters.map((sem) => sem.map((num) => console.log(`${this.semesters.indexOf(sem)}, ${num}`)));
  }

  maxPreqSem = num => {
    let result = -1;
    this.preqs.map((preq) => {
      if (preq[1] === num) {
        // find the semester of the preq
        this.semesters.map((sem) => {
          if (sem.includes(preq[0])
              && this.semesters.indexOf(sem) > result) {
            result = this.semesters.indexOf(sem);
          }
        });
      }
    });
    return result;
  }

  earliestDescendant = num => {
    let result = this.numSems;
    this.preqs.map((preq) => {
      if (preq[0] === num) {
        this.semesters.map((sem) => {
          if (sem.includes(preq[1])
              && this.semesters.indexOf(sem) < result) {
            result = this.semesters.indexOf(sem);
          }
        });
      }
    });
    return result;
  }

  onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {

    } else {

      const sDropID = source.droppableId.toString();
      const sSemPos = sDropID.substring(sDropID.length - 1);

      const num = this.semesters[sSemPos][source.index];
      console.log(num);
      console.log(sSemPos);

      const dDropID = destination.droppableId.toString();
      const dSemPos = dDropID.substring(sDropID.length - 1);

      // if the latest preq is the desination or later, alert and abort
      if (this.maxPreqSem(num) >= dSemPos
          || this.earliestDescendant(num) <= dSemPos) {
        swal('Prerequisite Error', 'Prerequisites not met for this timeline');
        return;
      }

      const theId = this.keyToId.get(this.keyForSemAndNum(sSemPos, num));

      Courses.collection.update({ _id: theId }, { $set: { semester: dSemPos } });
    }
  };

  render() {
    this.props.courses.map((c) => {
      if (this.owner == null) {
        this.owner = c.owner;
      }
    });

    this.refreshSemsAndIds();

    return (
        <div className='landing-background'>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <div>
              {this.semesters.map((sem) =>
                  <div>
                    <Droppable droppableId={`drop${this.semesters.indexOf(sem)}`}>
                      {(provided, snapshot) => (
                          <div ref={provided.innerRef}
                               style={getListStyle(snapshot.isDraggingOver)}>
                            {this.semNames[this.semesters.indexOf(sem)]}
                            {sem.map((num, index) =>
                                <Draggable
                                    key={`${this.semesters.indexOf(sem)}-${num}`}
                                    draggableId={`drag-${num}`}
                                    index={index}>
                                  {(provided, snapshot) => (
                                      <div id={`drag-${num}`}
                                           ref={provided.innerRef}
                                           {...provided.draggableProps}
                                           {...provided.dragHandleProps}
                                           style={getItemStyle(
                                               snapshot.isDragging,
                                               provided.draggableProps.style,
                                           )}>
                                        ICS {num}
                                      </div>
                                  )}
                                </Draggable>)}
                            {provided.placeholder}
                          </div>)}
                    </Droppable>
                  </div>)}
            </div>
          </DragDropContext>
          {this.preqs.map((preq) =>
              <Xarrow start={`drag-${preq[0]}`}
                      end={`drag-${preq[1]}`}/>)}
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
  const s1 = Meteor.subscribe(Courses.userPublicationName);
  return {
    courses: Courses.collection.find({}).fetch(),
    ready: s1.ready(),
  };
})(Progress);
