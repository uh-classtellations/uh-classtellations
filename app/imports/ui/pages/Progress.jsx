// Drag-and-drop made with help from https://codesandbox.io/s/react-kanban-demo-forked-e3k0w?file=/src/index.js:0-132

// Arrows made with help from https://codesandbox.io/embed/github/Eliav2/react-xarrows/tree/master/examples?fontsize=14&hidenavigation=1&theme=dark

import React, { useState } from 'react';
import { Container } from 'semantic-ui-react';
import Board, { moveCard } from '@lourenci/react-kanban';
// import ProgressView from '../components/ProgressView';

// import Semester from '../components/Semester';

const board = {
  columns: [
    {
      id: 1,
      title: 'Spring 2020',
      cards: [
        {
          id: 1,
          title: 'Card title 1',
          description: 'Card content',
        },
        {
          id: 2,
          title: 'Card title 2',
          description: 'Card content',
        },
        {
          id: 3,
          title: 'Card title 3',
          description: 'Card content',
        },
      ],
    },
    {
      id: 2,
      title: 'Summer 2020',
      cards: [
        {
          id: 9,
          title: 'Card title 9',
          description: 'Card content',
        },
      ],
    },
    {
      id: 3,
      title: 'Fall 2020',
      cards: [
        {
          id: 10,
          title: 'Card title 10',
          description: 'Card content',
        },
        {
          id: 11,
          title: 'Card title 11',
          description: 'Card content',
        },
      ],
    },
  ],
};

function ProgressView() {

  const [controlledBoard, setBoard] = useState(board);

  function handleCardMove(_card, source, destination) {
    const updatedBoard = moveCard(controlledBoard, source, destination);
    setBoard(updatedBoard);
  }

  return (
      <Board onCardDragEnd={handleCardMove} disableColumnDrag>
        {controlledBoard}
      </Board>
  );
}

class Progress extends React.Component {
  render() {
    return (
        <div className='landing-background'>
          <Container id='progress-view'>
            <ProgressView/>
          </Container>
        </div>
    );
  }
}

export default Progress;

