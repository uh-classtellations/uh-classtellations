import React from 'react';
import Sortable from "sortablejs";
import { Sortable, MultiDrag, Swap, OnSpill, AutoScroll } from "sortablejs";

var el = document.getElementById("items");
var sortable = Sortable.create(el);

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {

  render() {
    return (
        <ul id="items">
          <li>item 1</li>
          <li>item 2</li>
          <li>item 3</li>
        </ul>
    );
  }
}

export default Landing;
