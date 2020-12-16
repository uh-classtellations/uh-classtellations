import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

import { Courses } from '../../api/course/Course';

/* eslint-disable no-console */

const defaultProgress = [
  [0, 111], [0, 141],
  [1, 211], [1, 241],
  [2, 212], [2, 311], [2, 314],
  [3, 321], [3, 332], [3, 351],
  [4, 414], [4, 313], [4, 312],
  [5, 422], [5, 427], [5, 496],
];

const fourCreds = [111, 211, 311];

function createUser(email, password, role) {

  console.log(`  Creating user ${email}.`);
  const userID = Accounts.createUser({
    username: email,
    email: email,
    password: password,
  });
  if (role === 'admin') {
    Roles.createRole(role, { unlessExists: true });
    Roles.addUsersToRoles(userID, 'admin');
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
}

/** When running app for first time, pass a settings file to set up a default user account. */
if (Meteor.users.find().count() === 0) {
  if (Meteor.settings.defaultAccounts) {
    console.log('Creating the default user(s)');
    Meteor.settings.defaultAccounts.map(({ email, password, role }) => createUser(email, password, role));
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}
