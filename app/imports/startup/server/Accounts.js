import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

import { Courses } from '../../api/course/Course';

/* eslint-disable no-console */

const defaultProgress = [[0, 111], [0, 141], [1, 211], [1, 241], [2, 212], [2, 311]];

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
    const s = defaultProgress[i][0];
    const n = defaultProgress[i][1];
    Courses.collection.insert({ semester: s, num: n, credits: 3, status: '--', grade: '--', owner: email },
        (error) => {
          if (error) {
            console.log('Course init failed');
          } else {
            console.log(`Inserted ${n} at ${s} for ${email}`);
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
