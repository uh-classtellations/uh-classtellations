import React from 'react';
// import Sortable from "sortablejs";
import { Header } from 'semantic-ui-react';
// import { Sortable, MultiDrag, Swap, OnSpill, AutoScroll } from "sortablejs";

// var el = document.getElementById("items");
// var sortable = Sortable.create(el);

/** A simple static component to render some text for the landing page. */
class Progress extends React.Component {

  render() {
    return (
        <div className="landing-background">
          <Header as='h1' textAlign='center' inverted>
            This page is currently under development.
          </Header>
          <Header as='h2' textAlign='center' inverted>
            It will utilize SortableJS with the intent to resemble the mockup on <a className='external-link' href='https://uh-classtellations.github.io/'>our Home Page.</a>
          </Header>
        </div>
    );
  }
}

export default Progress;
