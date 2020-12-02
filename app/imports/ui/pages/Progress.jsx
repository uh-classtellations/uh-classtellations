// Drag-and-drop made with help from https://codesandbox.io/s/react-kanban-demo-forked-e3k0w?file=/src/index.js:0-132

// Arrows (in progress) made with help from https://codesandbox.io/embed/github/Eliav2/react-xarrows/tree/master/examples?fontsize=14&hidenavigation=1&theme=dark

import React, { useState } from 'react';
import { Container } from 'semantic-ui-react';
import Board, { moveCard } from '@lourenci/react-kanban';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const board = {
  columns: [
    {
      id: 1,
      title: 'Fall 2019',
      cards: [
        {
          id: 1,
          title: 'ICS 211',
          description: 'Introduction to Computer Science II',
        },
        {
          id: 2,
          title: 'ICS 212',
          description: 'Program Structure',
        },
        {
          id: 3,
          title: 'ICS 311',
          description: 'Algorithms',
        },
      ],
    },
    {
      id: 2,
      title: 'Spring 2020',
      cards: [
        {
          id: 9,
          title: 'ICS 314',
          description: 'Software Engineering I',
        },
      ],
    },
    {
      id: 3,
      title: 'Fall 2020',
      cards: [
        {
          id: 10,
          title: 'ICS 321',
          description: 'Database Systems I',
        },
        {
          id: 11,
          title: 'ICS 235',
          description: 'Machine Learning Methods',
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

  printDocument() {
    // eslint-disable-next-line no-undef
    // alert('Now downloading progress image.  This may take a few seconds.');
    // eslint-disable-next-line no-undef
    const input = document.getElementById('divToPrint');
    html2canvas(input)
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          // eslint-disable-next-line new-cap
          const pdf = new jsPDF();
          pdf.addImage(imgData, 'JPEG', 0, 0);
          pdf.save('download.pdf');
        });
  }

  render() {
    return (
        <div id='divToPrint' className='landing-background'>
          <div className='mb5'>
            <button onClick={this.printDocument}>Print</button>
          </div>
          <Container id='progress-view'>
            <ProgressView/>
          </Container>
        </div>
    );
  }
}

export default Progress;
