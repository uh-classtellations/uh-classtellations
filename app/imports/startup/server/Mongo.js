import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Stuffs } from '../../api/stuff/Stuff.js';
import { Courses } from '../../api/course/Course';

/* eslint-disable no-console */
/** Define a user in the Meteor accounts package. This enables login. Username is the email address. */
function createUser({ email, password }) {
  console.log(`Defining user ${email}`);
  Accounts.createUser({ email: email, password: password });
}

/** Initialize the database with a default data document. */
function addData(data) {
  console.log(`  Adding: ${data.name} (${data.owner})`);
  Stuffs.collection.insert(data);
}

/** Initialize the collection if empty. */
if (Stuffs.collection.find().count() === 0) {
  if (Meteor.settings.defaultData) {
    console.log('Creating default data.');
    Meteor.settings.defaultData.map(data => addData(data));
  }
}

/** Defines new course for user. Error if exact course already exists. */
function addCourse({ semester, year, name, credits, status, grade, owner }) {
  console.log(`Defining course ${name}`);
  // Create the profile.
  Courses.collection.insert({ semester, year, name, credits, status, grade, owner });
}

/**
 * If the loadAssetsFile field in settings.development.json is true, then load the data in private/data.json.
 * This approach allows you to initialize your system with large amounts of data.
 * Note that settings.development.json is limited to 64,000 characters.
 * We use the "Assets" capability in Meteor.
 * For more info on assets, see https://docs.meteor.com/api/assets.html
 * User count check is to make sure we don't load the file twice, which would generate errors due to duplicate info.
 */
if ((Meteor.settings.loadAssetsFile) && (Meteor.users.find().count() < 9)) {
  const assetsFileName = 'data.json';
  console.log(`Loading data from private/${assetsFileName}`);
  const jsonData = JSON.parse(Assets.getText(assetsFileName));
  jsonData.users.map(user => createUser(user));
  jsonData.courses.map(course => addCourse(course));
}
