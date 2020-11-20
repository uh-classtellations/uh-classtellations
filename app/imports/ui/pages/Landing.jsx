import React from 'react';
import { Grid, Image, Header } from 'semantic-ui-react';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  render() {
    return (
        <div className="landing-background">
          <Grid id='landing-page' verticalAlign='middle' textAlign='center' container>

            <Grid.Column width={4}>
              <Image size='medium' src="/images/uhmlogo.png"/>
            </Grid.Column>

            <Grid.Column width={8}>
              <Header as='h1' inverted>LET THE STARS GUIDE YOU</Header>
              <Header as='p' inverted>PLAN YOUR SUCCESS AT UH MANOA</Header>
            </Grid.Column>
          </Grid>

          <Grid columns={3}>
            <Grid.Row>
              <Grid.Column>
              </Grid.Column>
              <Grid.Column>
                <Header as='h2' textAlign='left' inverted>CLASSTELLATION noun</Header>
                <Header as='h3' textAlign='left' inverted>klas-tuh-lei-shun</Header>
                <Header as='h4' floated='center' inverted>
                  1: A configuration of stars, representing your courses, used to help guide you on your academic
                  journey at the University of Hawaii at Manoa.
                </Header>
                <Header as='h2' textAlign='center' inverted>
                  UH Classtellations uses a semester-by-semester flowchart view of your ICS major classes- past,
                  present, and future, as a visual aid to help you plan ahead.
                </Header>
                <Header as='h2' textAlign='center' inverted>
                  Showing prerequisites with arrows, you can experiment class combinations and timing to build your
                  optimal path toward graduation.
                </Header>
                <Header as='h5' textAlign='center' inverted>
                  For more information, check out <a className='external-link' href='https://uh-classtellations.github.io/'>our Home Page.</a>
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
    );
  }
}

export default Landing;
