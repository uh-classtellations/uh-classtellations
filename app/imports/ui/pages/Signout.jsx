import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Header } from 'semantic-ui-react';

/** After the user clicks the "Signout" link in the NavBar, log them out and display this page. */
export default class Signout extends React.Component {
  render() {
    Meteor.logout();
    return (
        <div className="landing-background">
          <Header id="signout-page" as="h2" textAlign="center">
            <Header as='h1' inverted>You are signed out.</Header>
          </Header>
        </div>
    );
  }
}
