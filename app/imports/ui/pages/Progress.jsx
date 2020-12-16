// Drag and drop made referencing https://codesandbox.io/s/ql08j35j3q?file=/index.js:2606-2614

import React from 'react';
import { Grid } from 'semantic-ui-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-render-offscreen';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Xarrow from 'react-xarrows';
import swal from 'sweetalert';

import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Courses } from '../../api/course/Course';

// style for courses
const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',

  background: 'rgba(250, 250, 250, 0.7)',
  borderRadius: 3,
  width: 'auto',
  minWidth: 60,
  height: 'auto',
  minHeight: 40,
  margin: '0 0 2px 0',
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
  padding: 2,
  width: 'auto',
  minWidth: 40,
  height: 900,
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

  printDocument() {
    // eslint-disable-next-line no-undef
    // alert('Now downloading progress image.  This may take a few seconds.');
    // eslint-disable-next-line no-undef
    const input = document.getElementById('divToPrint');
    const divHeight = input.clientHeight;
    const divWidth = input.clientWidth;
    const ratio = divHeight / divWidth;

    html2canvas(input, { scale: '1' }).then((canvas) => {
      const imgData = canvas.toDataURL('image/jpeg');
      const pdfDOC = new jsPDF("l", "mm", "a0"); //  use a4 for smaller page

      const width = pdfDOC.internal.pageSize.getWidth();
      let height = pdfDOC.internal.pageSize.getHeight();
      height = ratio * width;

      pdfDOC.addImage(imgData, 'JPEG', 0, 0, width - 20, height - 10);
      pdfDOC.save('summary.pdf');
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
      [314, 4141],
      [311, 422],
      [311, 461],
      [314, 427],
    ];
  }

  keyForSemAndNum = (sem, num) => (`${sem}-${num}`);

  // update the semester and id arrays from the database
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
    // console.log(this.semesters);
    // this.semesters.map((sem) => sem.map((num) => console.log(`${this.semesters.indexOf(sem)}, ${num}`)));
  }

  // the latest semester of the preqs for a course
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

  // the earliest semester of any course for which the passed course is a preq
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

  totalCredits = (sem) => {
    if (this.semesters[sem]) {
      let result = 0;
      console.log(this.semesters[5]);
      this.semesters[sem].map((course) => {
        if (fourCreds.includes(course)) result += 4;
        else result += 3;
      });
      return result;
    }
  };

  onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {

    } else {
      const sDropID = source.droppableId.toString();

      // the
      const sSemPos = sDropID.substring(sDropID.length - 1);

      const num = this.semesters[sSemPos][source.index];

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
    this.props.courses.map((c) => {
      if (this.owner == null) {
        this.owner = c.owner;
      }
    });

    this.refreshSemsAndIds();

    return (
        <div className='landing-background'>
          {this.preqs.map((preq) =>
              <Xarrow start={`drag-${preq[0]}`}
                      end={`drag-${preq[1]}`}/>)}
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Grid id='progress-view' columns={this.numSems} divided>
              <Grid.Row>
                {this.semesters.map((sem) =>
                    <div>
                      <Droppable droppableId={`drop${this.semesters.indexOf(sem)}`}>
                        {(provided, snapshot) => (
                            <div>
                              <div className='semester-info'>
                                {this.semNames[this.semesters.indexOf(sem)]}
                              </div>
                              <div className='semester-info'>
                                {`Credits: ${this.totalCredits(this.semesters.indexOf(sem))}`}
                              </div>
                              <Grid.Column className='semester'>
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
            <div as='p'> If arrows don't update, you may need to refresh the page</div>
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
  const s1 = Meteor.subscribe(Courses.userPublicationName);
  return {
    courses: Courses.collection.find({}).fetch(),
    ready: s1.ready(),
  };
})(Progress);
