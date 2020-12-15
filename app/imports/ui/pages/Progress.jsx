// Drag and drop made referencing https://codesandbox.io/s/ql08j35j3q?file=/index.js:2606-2614

import React, { Component, useState } from 'react';
import { Container } from 'semantic-ui-react';
import Board, { moveCard } from '@lourenci/react-kanban';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import ProgCourse from '../components/ProgCourse';

import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Courses } from '../../api/course/Course';

// fake data generator
const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
      id: `item-${k + offset}`,
      content: `item ${k + offset}`
    }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const grid = 5;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250
});

class Progress extends React.Component {

  state = {
    items: getItems(10),
    selected: getItems(5, 10)
  };

  id2List = {
    droppable: 'items',
    droppable2: 'selected',
  };

  getList = id => this.state[this.id2List[id]];

  onDragEnd = result => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
          this.getList(source.droppableId),
          source.index,
          destination.index
      );

      let state = { items };

      if (source.droppableId === 'droppable2') {
        state = { selected: items };
      }

      this.setState(state);
    } else {
      const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
      );

      this.setState({
        items: result.droppable,
        selected: result.droppable2
      });
    }
  };

  render() {
    return (
        <div className='landing-background'>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                  <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}>
                    {this.state.items.map((item, index) => (
                        <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}>
                          {(provided, snapshot) => (
                              <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(
                                      snapshot.isDragging,
                                      provided.draggableProps.style
                                  )}>
                                {item.content}
                              </div>
                          )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
              )}
            </Droppable>
            <Droppable droppableId="droppable2">
              {(provided, snapshot) => (
                  <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}>
                    {this.state.selected.map((item, index) => (
                        <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}>
                          {(provided, snapshot) => (
                              <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(
                                      snapshot.isDragging,
                                      provided.draggableProps.style
                                  )}>
                                {item.content}
                              </div>
                          )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
              )}
            </Droppable>
            {this.props.courses.map((course) => <ProgCourse key={course._id} course={course} Courses={Courses}/>)}
          </DragDropContext>
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
