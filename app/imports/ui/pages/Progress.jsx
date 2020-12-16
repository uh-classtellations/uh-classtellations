// Drag and drop made referencing https://codesandbox.io/s/ql08j35j3q?file=/index.js:2606-2614

import React, { Component, useState, useRef } from 'react';
import { Grid } from 'semantic-ui-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';

import Xarrow from 'react-xarrows';

import swal from 'sweetalert';

import { Courses } from '../../api/course/Course';
// import { Semesters } from '../../api/semester/Semester';

// fake data generator
// const getItems = (count, offset = 0) =>
//     Array.from({ length: count }, (v, k) => k).map(k => ({
//       id: `item-${k + offset}`,
//       content: `item ${k + offset}`
//     }));
//
// // a little function to help us with reordering the result
// const reorder = (list, startIndex, endIndex) => {
//   const result = Array.from(list);
//   const [removed] = result.splice(startIndex, 1);
//   result.splice(endIndex, 0, removed);
//
//   return result;
// };

/**
 * Moves an item from one list to another list.
 */
// const move = (source, destination, droppableSource, droppableDestination) => {
//   const sourceClone = Array.from(source);
//   const destClone = Array.from(destination);
//   const [removed] = sourceClone.splice(droppableSource.index, 1);
//
//   destClone.splice(droppableDestination.index, 0, removed);
//
//   const result = {};
//   result[droppableSource.droppableId] = sourceClone;
//   result[droppableDestination.droppableId] = destClone;
//
//   return result;
// };

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
  justifyContent: 'space-evenly',
  padding: grid,
  width: 90,
  height: 500,
});

const defSems = (count) => {
  const result = new Array(count);
  for (let i = 0; i < count; i++) {
    result[i] = [];
  }
  return result;
};

const numSems = 10;

class Progress extends React.Component {

  // componentDidMount() {
  //
  // this.refreshSems();
  //   console.log('1111');
  //
  //   this.props.courses.map((c) => console.log('---' + c));
  // }

  userId = Meteor.userId();
  // owner = this.users.findOne({id_: this.userId });

  semesters = defSems(numSems);

  keyToId = new Map();

  owner = null;

  preqs = [
    [111, 211],
    [141, 241],
    [211, 212],
    [211, 311],
    [241, 311],
  ]

  componentDidMount() {
  }

  keyForSemAndNum = (sem, num) => (`${sem}-${num}`);

  refreshSupportData = () => {
    while (this.semesters.length > 0) this.semesters.pop();
    while (this.keyToId.length > 0) this.ids.pop();
    this.semesters = defSems(numSems);
    this.props.courses.map((course) => {
      this.semesters[course.semester].push(course.num);
      this.keyToId.set(
          this.keyForSemAndNum(course.semester, course.num),
          course._id);
    });
    // const sem = course.semester;
    // const num = course.num;
    // console.log(`${sem} length ${semesters[sem].length}`);
    // if (semesters[sem].length === 0) {
    //   console.log('m');
    //   semesters.push([num]);
    // } else {
    //   console.log('p');
    //   semesters[sem].push(num);
    // }
    // });
    console.log(this.semesters);
    this.semesters.map((sem) => sem.map((num) => console.log(`${this.semesters.indexOf(sem)}, ${num}`)));
  }

  // state = {
  //   // items: getItems(10),
  //   items: Array.from(this.props.courses.map((course) => ({
  //     id: course._id,
  //     content: `ICS ${course.num}` }))),
  //   selected: getItems(5),
  // };

  // id2List = {
  //   droppable: 'items',
  //   droppable2: 'selected',
  // };

  getList = id => this.state[this.id2List[id]];

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

  onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      // return;

      // if (source.droppableId === destination.droppableId) {
      //   const items = reorder(
      //       this.getList(source.droppableId),
      //       source.index,
      //       destination.index,
      //   );
      //
      //   let state = { items };
      //
      //   if (source.droppableId === 'droppable2') {
      //     state = { selected: items };
      //   }
      //
      //   this.setState(state);
    } else {

      const sDropID = source.droppableId.toString();
      const sSemPos = sDropID.substring(sDropID.length - 1);

      const num = this.semesters[sSemPos][source.index];
      console.log(num);
      console.log(sSemPos);

      const dDropID = destination.droppableId.toString();
      const dSemPos = dDropID.substring(sDropID.length - 1);
      // const toRemove = Courses.collection.findOne({
      //   $and: [
      //     { semester: sSemPos },
      //     { num: num },
      //     { owner: this.owner },
      //   ],
      // });
      // console.log(toRemove);
      // Courses.collection.remove({ _id: toRemove._id });
      //
      // Courses.collection.update(_id, { $set: {}})
      // if the latest preq is the desination or later, alert and abort
      if (this.maxPreqSem(num) >= dSemPos) {
        swal('Prerequisite Error', 'Prerequisites not met for this timeline');
        return;
      }

      const theId = this.keyToId.get(this.keyForSemAndNum(sSemPos, num));

      Courses.collection.update({ _id: theId }, { $set: { semester: dSemPos } });

      // Courses.collection.remove({ semester: sSemPos, num: num, credits: 3, status: '--', grade: '--', owner: this.owner });
      // Courses.collection.remove({ semester: sSemPos, num: num, _id: Meteor.userId() });
      // Courses.collection.remove({ semester: sSemPos, num: num, owner: this.owner });
      // Courses.collection.insert({ semester: dSemPos, num: num, credits: 3, status: '--', grade: '--', owner: this.owner });

      // let semPos = sDropID.substring(sDropID.length() - 1);
      // Semesters.collection.update({ $pull: { semCourses: source.num } });
      // Semesters.collection.update({ $push: { semCourses: source.num } });
      // const result = move(
      //     this.getList(source.droppableId),
      //     this.getList(destination.droppableId),
      //     source,
      //     destination

      // this.setState({
      //   items: result.droppable,
      //   selected: result.droppable2
      // })
    }
  };

  render() {
    this.props.courses.map((c) => {
      if (this.owner == null) {
        this.owner = c.owner;
      }
    });

    //
    // this.props.courses.map((c) => {
    //   if (this.owner == null) {
    //     this.owner = c.owner;
    //   }
    //   console.log('11' + c);
    // });

    // console.log('111' + this.owner);

    // console.log(Array.from(this.props.courses.map((course) => ({ a: course.num, b: course._id }))));
    // console.log(this.props.courses);
    // console.log(this.props.sems);

    // const id2List = Array.from(this.props.sems.map((sem) => ({ `droppable${sem.semester}`: `sem${semester}` })));
    // );

    this.refreshSupportData();

    return (
        <div className='landing-background'>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Grid className='progress-view'>
              {this.semesters.map((sem) =>
                  <Grid.Column className='semester'>
                    <Droppable droppableId={`drop${this.semesters.indexOf(sem)}`}>
                      {(provided, snapshot) => (
                          <div ref={provided.innerRef}
                               style={getListStyle(snapshot.isDraggingOver)}>
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
                                </Draggable>
                            )}
                            {provided.placeholder}
                          </div>)}
                    </Droppable>
                  </Grid.Column>)}
            </Grid>
          </DragDropContext>
          {this.preqs.map((preq) => <Xarrow start={`drag-${preq[0]}`}
                                            end={`drag-${preq[1]}`}/>)}
        </div>
    );
  }

}

// function Semesters() {
//   const sems = useState(0);
// }

  Progress
.
  propTypes = {
    courses: PropTypes.array.isRequired,
    Courses: PropTypes.object.isRequired,
    // users: PropTypes.array.isRequired,
    // Users: PropTypes.object.isRequired,
    // sems: PropTypes.array.isRequired,
    // Sems: PropTypes.object.isRequired,
    ready: PropTypes.bool.isRequired,
  };

  export
  default

  withTracker(

() => {
  // Get access to Stuff documents.
  const
  s1 = Meteor.subscribe(Courses.userPublicationName);
  return {
  courses: Courses.collection.find
( {
}

).
fetch(),
    // sems: Semesters.collection.find({}).fetch(),
    ready
:
s1.ready(),
}
;
})
(Progress);
