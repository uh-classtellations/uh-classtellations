import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

import { Courses } from '../../api/course/Course';
import { Semesters } from '../../api/semester/Semester';

/* eslint-disable no-console */

const defaultProgress = [[0, 111], [0, 141], [1, 211], [1, 241]];

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
    Courses.collection.insert({ semester: s, num: n, credits: 3, status: '--', grade: '--', owner: email });
    // console.log(`Inserted ${n} at ${s} for ${email}`);
    const temp = Semesters.collection.find({ semester: s, owner: email }).count();
    console.log('tt' + temp);
    if (temp > 0) {
      Semesters.collection.update({ semester: s }, { $push: { semCourses: n } });
      console.log(`Inserted ${n} into sem ${s}`);
    } else {
      console.log(`Creating semester with ${n} into sem ${s}`);
      Semesters.collection.insert({ semester: s, semCourses: n, owner: email });
    }
  }
  // console.log(Semesters.collection.find());
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
