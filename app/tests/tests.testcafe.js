import { landingPage } from './landing.page';
import { signinPage } from './signin.page';
import { signoutPage } from './signout.page';
import { navBar } from './navbar.component';
import { advisorsPage } from './advisors.page';
import { progressPage } from './progress.page';
import { transcriptPage } from './transcript.page';
import { addCourseComponent } from './addcourse.component';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'john@foo.com', password: 'changeme' };

fixture('meteor-application-template-react localhost test with default db')
    .page('http://localhost:3000');

test('Test that landing page shows up', async (testController) => {
  await landingPage.isDisplayed(testController);
});

test('Test that signin, pages, and signout work', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.isLoggedIn(testController, credentials.username);
  await landingPage.isDisplayed(testController);
  await navBar.gotoAdvisors(testController);
  await advisorsPage.isDisplayed(testController);
  await navBar.gotoProgress(testController);
  await progressPage.isDisplayed(testController);
  await navBar.gotoTranscript(testController);
  await transcriptPage.isDisplayed(testController);
  await addCourseComponent.addCourse(testController);
  await navBar.logout(testController);
  await signoutPage.isDisplayed(testController);
});
