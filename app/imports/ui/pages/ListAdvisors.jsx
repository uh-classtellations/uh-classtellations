import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Loader, Card } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Stuffs } from '../../api/stuff/Stuff';
import Advisor from '../components/Advisor';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class ListAdvisors extends React.Component {

  advisors = [{
    firstName: 'Gerald', lastName: 'Lau', address: 'POST 303A, University of Hawaii',
    image: 'https://natsci.manoa.hawaii.edu/sasc/advisors/ics/index_files/image_21611.jpg',
    description: 'ICS Major Advisor',
  },
    {
      firstName: 'Kenny', lastName: 'Quibilan', address: 'POST 303A, University of Hawaii',
      image: 'https://natsci.manoa.hawaii.edu/sasc/advisors/ics/index_files/image_21645.jpg',
      description: 'ICS Major Advisor',
    },
    {
      firstName: 'Kory', lastName: 'Scholly-Bromwell', address: 'POST 303A, University of Hawaii',
      image: 'https://natsci.manoa.hawaii.edu/sasc/photos/kory-scholly-bromwell.min.jpg',
      description: 'ICS Major Advisor',
    },
  ];

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    return (
        <div className="landing-background">
          <Container>
            <Header as="h2" textAlign="center" inverted>ICS Advisors</Header>
            <Card.Group>
              {this.advisors.map((advisor, index) => <Advisor key={index} advisor={advisor}/>)}
            </Card.Group>
          </Container>
        </div>
    );
  }
}

/** Require an array of Stuff documents in the props. */
ListAdvisors.propTypes = {
  stuffs: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe(Stuffs.userPublicationName);
  return {
    stuffs: Stuffs.collection.find({}).fetch(),
    ready: subscription.ready(),
  };
})(ListAdvisors);
