import { Selector } from 'testcafe';

class AddCourseComponent {

  /** Adds new course */
  async addCourse(testController) {
    const year = '2020';
    // Define the new course year--Use default form values.
    await testController.typeText('#year', year);

    await testController.click('#submit');
    await testController.click(Selector('.swal-button--confirm'));
  }
}

export const addCourseComponent = new AddCourseComponent();
