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
            This page is currently under development. Check back soon!
          </Header>
        </div>
    );
  }
}

export default Progress;
