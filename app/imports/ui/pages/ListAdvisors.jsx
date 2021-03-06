import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Loader, Card } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Stuffs } from '../../api/stuff/Stuff';
import Advisor from '../components/Advisor';
import Requirement from '../components/Requirements';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class ListAdvisors extends React.Component {

  advisors = [{
    firstName: 'Gerald', lastName: 'Lau', address: 'POST 303A, University of Hawaii',
    image: 'https://natsci.manoa.hawaii.edu/sasc/advisors/ics/index_files/image_21611.jpg',
    description: 'Major Advisor: Associate Faculty Specialist',
  },
    {
      firstName: 'Kenny', lastName: 'Quibilan', address: 'POST 303A, University of Hawaii',
      image: 'https://natsci.manoa.hawaii.edu/sasc/advisors/ics/index_files/image_21645.jpg',
      description: 'Major Advisor: Manoa Peer Advisor',
    },
    {
      firstName: 'Kory', lastName: 'Scholly-Bromwell', address: 'POST 303A, University of Hawaii',
      image: 'https://natsci.manoa.hawaii.edu/sasc/photos/kory-scholly-bromwell.min.jpg',
      description: 'Major Advisor: Manoa Peer Advisor',
    },
    {
      firstName: 'Max', lastName: 'Lee', address: 'Sinclair 301, University of Hawaii',
      image: 'https://natsci.manoa.hawaii.edu/sasc/advisors/ics/index_files/image_p21634_n10.jpg',
      description: 'College Advisor: Undergraduate Academic Advisor & Study Abroad Advisor',
    },
    {
      firstName: 'Reynold', lastName: 'Kajiwara', address: 'Sinclair 301, University of Hawaii',
      image: 'https://natsci.manoa.hawaii.edu/sasc/advisors/ics/index_files/image_p21635_n10.jpg',
      description: 'College Advisor: Undergraduate Academic Advisor',
    },
    {
      firstName: 'Solimar', lastName: 'Carrasquillo Ho', address: 'Sinclair 301, University of Hawaii',
      image: 'https://natsci.manoa.hawaii.edu/sasc/advisors/ics/index_files/image_p21636_n10.jpg',
      description: 'College Advisor: Undergraduate Academic Advisor',
    },
    {
      firstName: 'Eugene', lastName: 'Marquez', address: 'Sinclair 301, University of Hawaii',
      image: 'https://natsci.manoa.hawaii.edu/sasc/advisors/ics/index_files/image_p21637_n10.jpg',
      description: 'College Advisor: Manoa Peer Advisor, Freshmen 30 credits or less',
    },
    {
      firstName: 'Germaine', lastName: 'Lindsay Juan', address: 'Sinclair 301, University of Hawaii',
      image: 'https://natsci.manoa.hawaii.edu/sasc/advisors/ics/index_files/image_p22211_n37.jpg',
      description: 'College Advisor: Manoa Peer Advisor, Freshmen 30 credits or less',
    },
  ];

  requirements = [{
      degree: 'Bachelor of Science in Computer Science',
    description: 'Focuses on software technology and gives the student a firm foundation in science and math.',
    link: 'http://www.ics.hawaii.edu/academics/undergraduate-degree-programs/bs-ics/',
    },
    {
      degree: 'Bachelor of Science in Computer Engineering',
      description: 'Focuses on hardware and software technologies and how they are used together to create systems.',
      link: 'http://www.ics.hawaii.edu/academics/undergraduate-degree-programs/bs-ce/',
    },
    {
      degree: 'Bachelor of Arts in Information and Computer Science',
      description: 'Allows students to combine computer science with another discipline.',
      link: 'http://www.ics.hawaii.edu/academics/undergraduate-degree-programs/ba-ics/',
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
          <Container id="advisors-page">
            <Header as="h1" textAlign="center" inverted>ICS Advisors</Header>
            <Card.Group>
              {this.advisors.map((advisor, index) => <Advisor key={index} advisor={advisor}/>)}
            </Card.Group>
          </Container>
          <Container className="add-padding">
            <Header as="h1" textAlign="center" inverted>Undergraduate Degree Requirements</Header>
            <Card.Group>
              {this.requirements.map((requirement, index) => <Requirement key={index} requirement={requirement}/>)}
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
