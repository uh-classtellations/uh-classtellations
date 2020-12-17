import React from 'react';
import { Header, Grid, Button } from 'semantic-ui-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-render-offscreen';

// Drag and drop made referencing https://codesandbox.io/s/ql08j35j3q?file=/index.js:2606-2614
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import Xarrow from 'react-xarrows';
import swal from 'sweetalert';

import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

import { withTracker } from 'meteor/react-meteor-data';
import { Courses } from '../../api/course/Course';

// style for courses
const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  background: 'rgba(250, 250, 250, 0.7)',
  borderRadius: 3,
  width: 'auto',
  minWidth: 60,
  height: 'auto',
  minHeight: 40,
  padding: 10,

  textAlign: 'center',
  verticalAlign: 'middle',

  ...draggableStyle,
});

// style for semester columns
const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'rgba(175, 215, 250, 0.5)' : 'rgba(250, 250, 250, 0.2)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  width: 'auto',
  minWidth: 40,
  height: 'auto',
  minHeight: 700,
});

// to reset the semesters array
const emptySems = (numSems) => {
  const result = new Array(numSems);
  for (let i = 0; i < numSems; i++) {
    result[i] = [];
  }
  return result;
};

// semester names from indices depending on start year
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

const fourCreds = [111, 211, 311];

class Progress extends React.Component {

  printDocument = () => {
    // eslint-disable-next-line no-undef
    // alert('Now downloading progress image.  This may take a few seconds.');
    // eslint-disable-next-line no-undef
    const input = document.getElementById('div-to-print');
    const divHeight = input.clientHeight;
    const divWidth = input.clientWidth;
    const ratio = divHeight / divWidth;

    html2canvas(input, { scale: '1' }).then((canvas) => {
      const imgData = canvas.toDataURL('image/jpeg');
      // eslint-disable-next-line new-cap
      const pdfDOC = new jsPDF('l', 'mm', 'a0'); //  use a4 for smaller page

      const width = pdfDOC.internal.pageSize.getWidth();
      let height = pdfDOC.internal.pageSize.getHeight();
      height = ratio * width;

      pdfDOC.addImage(imgData, 'JPEG', 0, 0, width - 20, height - 10);
      pdfDOC.save('summary.pdf');
    });
  };

  constructor() {
    super();

    this.numSems = 9;

    this.firstYear = 2018;

    this.semNames = populateSemNames(this.firstYear, this.numSems);

    this.userId = Meteor.userId();

    this.semesters = emptySems(this.numSems);

    // identify courses using unique key from render function and class function
    this.keyToId = new Map();

    this.owner = null;
    this.ownerKnown = false;

    this.finishedCredits = 0;
    this.totalCredits = 0;
    this.latestFinishedSem = 4;

    // preqs for all courses in standard set
    this.preqs = [
      [111, 211],
      [141, 241],
      [211, 212],
      [211, 311],
      [241, 311],
      [211, 314],
      [211, 314],
      [311, 321],
      [311, 332],
      [311, 496],
      [314, 321],
      [314, 332],
      [314, 496],
      [212, 351],
      [311, 351],
      [314, 351],
      [212, 313],
      [311, 313],
      [314, 313],
      [212, 312],
      [311, 312],
      [314, 312],
      [311, 414],
      [314, 414],
      [311, 422],
      [311, 461],
      [314, 427],
    ];
  }

  keyForSemAndNum = (sem, num) => (`${sem}-${num}`);

  // update the semester and id arrays from the database
  refreshSupportData = () => {
    while (this.semesters.length > 0) this.semesters.pop();
    while (this.keyToId.length > 0) this.ids.pop();
    this.semesters = emptySems(this.numSems);
    this.props.courses.forEach((course) => {
      this.semesters[course.semester].push(course.num);
      this.keyToId.set(
          this.keyForSemAndNum(course.semester, course.num),
          course._id,
      );
    });
    this.totalCredits = 0;
    this.finishedCredits = 0;
    for (let i = 0; i < this.numSems; i++) {
      const semCredits = this.semCredits(i);
      this.totalCredits += semCredits;
      if (i <= this.latestFinishedSem) {
        this.finishedCredits += semCredits;
      }
    }
    // console.log(this.semesters);
    // this.semesters.map((sem) => sem.map((num) => console.log(`${this.semesters.indexOf(sem)}, ${num}`)));
  }

  // the latest semester of the preqs for a course
  maxPreqSem = num => {
    let result = -1;
    this.preqs.forEach((preq) => {
      if (preq[1] === num) {
        // find the semester of the preq
        this.semesters.forEach((sem) => {
          if (sem.includes(preq[0])
              && this.semesters.indexOf(sem) > result) {
            result = this.semesters.indexOf(sem);
          }
        });
      }
    });
    return result;
  }

  // the earliest semester of any course for which the passed course is a preq
  earliestDescendant = num => {
    let result = this.numSems;
    this.preqs.forEach((preq) => {
      if (preq[0] === num) {
        this.semesters.forEach((sem) => {
          if (sem.includes(preq[1])
              && this.semesters.indexOf(sem) < result) {
            result = this.semesters.indexOf(sem);
          }
        });
      }
    });
    return result;
  }

  semCredits = (sem) => {
    let result = 0;
    try {
      this.semesters[sem].forEach((course) => {
        if (fourCreds.includes(course)) result += 4;
        else result += 3;
      });
    } catch (error) {
      console.log(error);
    }
    return result;
  };

  onDragEnd = (result) => {
    const { source, destination } = result;

    // make sure course was dropped inside a list
    if (destination) {
      const sDropID = source.droppableId.toString();

      // semester of the source
      const sSemPos = sDropID.substring(sDropID.length - 1);

      // course num
      const num = this.semesters[sSemPos][source.index];

      // semester of the destination by ID
      const dDropID = destination.droppableId.toString();
      const dSemPos = dDropID.substring(sDropID.length - 1);

      // if the latest preq is the desination or later, alert and abort
      if (this.maxPreqSem(num) >= dSemPos
          || this.earliestDescendant(num) <= dSemPos) {
        swal('Prerequisite Error', 'Prerequisites are not met in this timeline');
        return;
      }

      // get the ID to update the database
      const theId = this.keyToId.get(this.keyForSemAndNum(sSemPos, num));
      Courses.collection.update({ _id: theId }, { $set: { semester: dSemPos } });
    }
  };

  render() {

    // inefficient, but it wouldn't update elsewhere
    if (!this.ownerKnown) {
      this.props.courses.forEach((c) => {
        if (this.owner == null) {
          this.owner = c.owner;
        }
      });
      if (this.owner !== null) this.ownerKnown = true;
    }

    this.refreshSupportData();

    return (
        <div className='landing-background'>
          <Header as='h1' className='progress-header' inverted>ICS General Track |
            Credits: {this.finishedCredits}/{this.totalCredits}
            {/* eslint-disable-next-line no-mixed-operators */}
            ({(100 * this.finishedCredits / this.totalCredits).toFixed(1)}%) </Header>
          <Button id='print-button' className='progress-header'
                  onClick={this.printDocument}>Print Progress</Button>
          <div id='div-to-print'>
            {this.preqs.map((preq) => <Xarrow start={`drag-${preq[0]}`}
                                              end={`drag-${preq[1]}`}
                                              key={`arrow-${preq[0]}-${preq[1]}`}/>)}
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Grid id='progress-view' divided>
                <Grid.Row>
                  {this.semesters.map((sem) => <div key={`sem-div-${this.semesters.indexOf(sem)}`}>
                    <Droppable droppableId={`drop-${this.semesters.indexOf(sem)}`}>
                      {(provided, snapshot) => (
                          <div className='semester'>
                            <Grid.Column className='semester-info'>
                              {this.semNames[this.semesters.indexOf(sem)]}
                            </Grid.Column>
                            <Grid.Column className='semester-info'>
                              {`Credits: ${this.semCredits(this.semesters.indexOf(sem))}`}
                            </Grid.Column>
                            <Grid.Column className='semester'>
                              <div ref={provided.innerRef}
                                   style={getListStyle(snapshot.isDraggingOver)}>
                                {sem.map((num, index) => <Draggable key={`${this.semesters.indexOf(sem)}-${num}`}
                                                                    draggableId={`drag-${num}`}
                                                                    index={index}>
                                  {(providedInner, snapshotInner) => (
                                      <div id={`drag-${num}`}
                                           ref={providedInner.innerRef}
                                           {...providedInner.draggableProps}
                                           {...providedInner.dragHandleProps}
                                           style={getItemStyle(
                                               snapshotInner.isDragging,
                                               providedInner.draggableProps.style,
                                           )}>
                                        ICS {num}
                                      </div>
                                  )}
                                </Draggable>)}
                                {provided.placeholder}
                              </div>
                            </Grid.Column>
                          </div>)}
                    </Droppable>
                  </div>)}
                </Grid.Row>
              </Grid>
            </DragDropContext>
            <div as='h4' className='semester-info'>
              <div as='p'>Note: not all courses are available each semester; check STAR if you are unsure</div>
              <div as='p'> If arrows don&#39;t update, you may need to refresh the page</div>
            </div>
          </div>
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
  const
      s1 = Meteor.subscribe(Courses.userPublicationName);
  return {
    courses: Courses.collection.find({}).fetch(),
    ready: s1.ready(),
  };
})(Progress);
