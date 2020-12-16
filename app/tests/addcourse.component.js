import { Selector } from 'testcafe';

class AddCourseComponent {

  /** Adds new course */
  async addCourse(testController) {
    const courseNum = '461';
    // Define the new course information.
    await testController.typeText('#num', courseNum);
    await testController.click('#submit');
    await testController.click(Selector('.swal-button--confirm'));
  }
}

export const addCourseComponent = new AddCourseComponent();
