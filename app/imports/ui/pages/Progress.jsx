import React from 'react';
import { Header } from 'semantic-ui-react';

/** A simple static component to render some text for the landing page. */
class Progress extends React.Component {
  render() {
    return (
        <div className="landing-background">
          <Header as='h1' inverted>
            This page is currently under development.  Check back soon!
          </Header>
        </div>
    );
  }
}

export default Progress;
