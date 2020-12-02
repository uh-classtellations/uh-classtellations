import React from 'react';
import { Card, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class Requirement extends React.Component {
  render() {
    return (
        <Card centered>
          <Card.Content>
            <Card.Header>{this.props.requirement.degree}</Card.Header>
            <Card.Description>
              {this.props.requirement.description}
            </Card.Description>
          </Card.Content>
          <Card.Content extra href={this.props.requirement.link}>
            <Button>Click Here For More Information</Button>
          </Card.Content>
        </Card>
    );
  }
}

/** Require a document to be passed to this component. */
Requirement.propTypes = {
  requirement: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(Requirement);
