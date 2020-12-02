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
    description: 'ICS Major Advisor: Associate Faculty Specialist',
  },
    {
      firstName: 'Kenny', lastName: 'Quibilan', address: 'POST 303A, University of Hawaii',
      image: 'https://natsci.manoa.hawaii.edu/sasc/advisors/ics/index_files/image_21645.jpg',
      description: 'ICS Major Advisor: Manoa Peer Advisor',
    },
    {
      firstName: 'Kory', lastName: 'Scholly-Bromwell', address: 'POST 303A, University of Hawaii',
      image: 'https://natsci.manoa.hawaii.edu/sasc/photos/kory-scholly-bromwell.min.jpg',
      description: 'ICS Major Advisor: Manoa Peer Advisor',
    },
    {
      firstName: 'Max', lastName: 'Lee', address: 'Sinclair 301, University of Hawaii',
      image: 'https://natsci.manoa.hawaii.edu/sasc/advisors/ics/index_files/image_p21634_n10.jpg',
      description: 'Undergraduate Academic Advisor & Study Abroad Advisor',
    },
    {
      firstName: 'Reynold', lastName: 'Kajiwara', address: 'Sinclair 301, University of Hawaii',
      image: 'https://natsci.manoa.hawaii.edu/sasc/advisors/ics/index_files/image_p21635_n10.jpg',
      description: 'Undergraduate Academic Advisor',
    },
    {
      firstName: 'Solimar', lastName: 'Carrasquillo Ho', address: 'Sinclair 301, University of Hawaii',
      image: 'https://natsci.manoa.hawaii.edu/sasc/advisors/ics/index_files/image_p21636_n10.jpg',
      description: 'Undergraduate Academic Advisor',
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
      degree: 'Bachelor of Science in Computer Science', description: 'The Bachelor of Science in Computer Science provides an in-depth foundation in programming, software development, technology systems, science, and math. You may find this degree of interest if you want to pursue software development as a career path or go to graduate school in computer science. The ICS Department offers a General degree and two specializations: Data Science and Security Science.', link: 'http://www.ics.hawaii.edu/academics/undergraduate-degree-programs/bs-ics/',
    },
    {
      degree: 'Bachelor of Science in Computer Engineering', description: 'The Department of Information and Computer Sciences and the Department of Electrical Engineering offer a joint Bachelor of Science degree in Computer Engineering (BS CE). The BSCE degree program provides you with the opportunity to learn about computer hardware and software, computer organization and architecture, computer security, software engineering, computer networks and Internet technology, embedded systems, computer-aided design, multi-core and parallel computing, wireless networks, and other topics.', link: 'http://www.ics.hawaii.edu/academics/undergraduate-degree-programs/bs-ce/',
    },
    {
      degree: 'Bachelor of Arts in Information and Computer Science', description: 'The Bachelor of Arts (BA) degree allows you to combine computer science with another discipline. You might find the BA degree of interest if you are also interested in biology, entrepreneurship, game design, graphic arts, financial engineering, foreign languages, or other disciplines.', link: 'http://www.ics.hawaii.edu/academics/undergraduate-degree-programs/ba-ics/',
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
          <Container className="add-padding">
            <Header as="h2" textAlign="center" inverted>Graduation Requirements</Header>
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
