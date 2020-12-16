import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { Container, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import { Accounts } from 'meteor/accounts-base';
import { Courses } from '../../api/course/Course';

const defaultProgress = [
  [0, 111], [0, 141],
  [1, 211], [1, 241],
  [2, 212], [2, 311], [2, 314],
  [3, 321], [3, 332], [3, 351],
  [4, 414], [4, 312],
  [5, 313], [5, 422], [5, 427], [5, 496],
];

const fourCreds = [111, 211, 311];

/**
 * Signup component is similar to signin component, but we create a new user instead.
 */
class Signup extends React.Component {
  /** Initialize state fields. */
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', error: '', redirectToReferer: false };
  }

  /** Update the form controls each time the user interacts with them. */
  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  /** Handle Signup submission. Create user account and a profile entry, then redirect to the home page. */
  submit = () => {
    const { email, password } = this.state;
    Accounts.createUser({ email, username: email, password }, (err) => {
      console.log('creating user');
      if (err) {
        this.setState({ error: err.reason });
      } else {
        this.setState({ error: '', redirectToReferer: true });
      }
      for (let i = 0; i < defaultProgress.length; i++) {
        const sem = defaultProgress[i][0];
        const num = defaultProgress[i][1];
        let c = 3;
        // Default semester for completion: Fall 2020
        let status = 'Upcoming';
        if (sem < 5) status = 'Completed';
        if (fourCreds.includes(num)) c = 4;
        Courses.collection.insert({ semester: sem, num: num, credits: c, status: status, grade: '--', owner: email },
            (error) => {
              if (error) {
                console.log('Course init failed');
              } else {
                // console.log(`Inserted ${n} at ${s} for ${email}`);
              }
            });
      }
    });
  }

  /** Display the signup form. Redirect to add page after successful registration and login. */
  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    // if correct authentication, redirect to from: page instead of signup screen
    if (this.state.redirectToReferer) {
      return <Redirect to={from}/>;
    }
    return (
        <div className="landing-background">
          <Container id="signup-page">
            <Grid textAlign="center" verticalAlign="middle" centered columns={2}>
              <Grid.Column>
                <Header as="h2" textAlign="center" inverted>
                  Register your account
                </Header>
                <Form onSubmit={this.submit}>
                  <Segment stacked>
                    <Form.Input
                        label="Email"
                        id="signup-form-email"
                        icon="user"
                        iconPosition="left"
                        name="email"
                        type="email"
                        placeholder="E-mail address"
                        onChange={this.handleChange}
                    />
                    <Form.Input
                        label="Password"
                        id="signup-form-password"
                        icon="lock"
                        iconPosition="left"
                        name="password"
                        placeholder="Password"
                        type="password"
                        onChange={this.handleChange}
                    />
                    <Form.Button id="signup-form-submit" content="Submit"/>
                  </Segment>
                </Form>
                <Message>
                  Already have an account? Login <Link to="/signin">here</Link>
                </Message>
                {this.state.error === '' ? (
                    ''
                ) : (
                    <Message
                        error
                        header="Registration was not successful"
                        content={this.state.error}
                    />
                )}
              </Grid.Column>
            </Grid>
          </Container>
        </div>
    );
  }
}

/** Ensure that the React Router location object is available in case we need to redirect. */
Signup.propTypes = {
  location: PropTypes.object,
};

export default Signup;
