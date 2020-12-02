
// import Sortable from "sortablejs";
import { Header } from 'semantic-ui-react';
    // import { Sortable, MultiDrag, Swap, OnSpill, AutoScroll } from "sortablejs";
// var el = document.getElementById("items");
// var sortable = Sortable.create(el);
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
/** A simple static component to render some text for the landing page. */
//class Progress extends React.Component {
import React, {Component, PropTypes} from 'react';
// download html2canvas and jsPDF and save the files in app/ext, or somewhere else
// the built versions are directly consumable
//import {html2canvas, jsPDF} from 'app/ext';


class Progress extends React.Component {
    constructor(props) {
        super(props);
    }

    printDocument() {
        const input = document.getElementById('divToPrint');
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                pdf.addImage(imgData, 'JPEG', 0, 0);
                // pdf.output('dataurlnewwindow');
                pdf.save("download.pdf");
            })
        ;
    }

    render() {
        return (<div>
            <div className="mb5">
                <button onClick={this.printDocument}>Print</button>
            </div>
            <div id="divToPrint" className="landing-background">
                    <Header as='h1' textAlign='center' inverted>
                        This page is currently under development.
                    </Header>
                    <Header as='h2' textAlign='center' inverted>
                        It will utilize SortableJS with the intent to resemble the mockup on <a className='external-link' href='https://uh-classtellations.github.io/'>our Home Page.</a>
                    </Header>
                </div>
        </div>);
    }
}

export default Progress;
