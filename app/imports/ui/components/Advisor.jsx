import React from 'react';
import { Card, Image, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class Advisor extends React.Component {
  render() {
    return (
        <Card centered>
          <Card.Content>
            <Image
                floated='right'
                size='mini'
                src={this.props.advisor.image}
            />
            <Card.Header>{this.props.advisor.firstName} {this.props.advisor.lastName}</Card.Header>
            <Card.Meta>{this.props.advisor.address}</Card.Meta>
            <Card.Description>
              {this.props.advisor.description}
            </Card.Description>
          </Card.Content>
          <Card.Content extra href={'https://www.star.hawaii.edu/appointment/index.jsp'}>
            <Button>Schedule An Appointment</Button>
          </Card.Content>
        </Card>
    );
  }
}

/** Require a document to be passed to this component. */
Advisor.propTypes = {
  advisor: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(Advisor);
