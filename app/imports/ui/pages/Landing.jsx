import React from 'react';
import { Grid, Image, Header, Icon } from 'semantic-ui-react';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  render() {
    return (
        <div className="classtellations-landing-background">
        <Grid id='landing-page' verticalAlign='middle' textAlign='center' container>

          <Grid.Column width={4}>
            <Image size='medium' src="/images/uhmlogo.png"/>
          </Grid.Column>

          <Grid.Column width={8}>
            <Header as='h1' inverted>USE THE STARS TO GUIDE YOUR FUTURE</Header>
            <Header as='p' inverted>PLAN YOUR SUCCESS AT UH MANOA</Header>
          </Grid.Column>

        </Grid>
        </div>
    );
  }
}

export default Landing;
