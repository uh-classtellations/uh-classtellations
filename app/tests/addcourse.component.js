import { Selector } from 'testcafe';

class AddCourseComponent {

  /** Adds new course */
  async addCourse(testController) {
    const year = '2020';
    // Define the new project
    await testController.typeText('#year', year);
    // Select two interests.
    const semesterSelector = Selector('#semester');
    const nameSelector = Selector('#name');
    const creditsSelector = Selector('#credits');
    const statusSelector = Selector('#status');
    const gradeSelector = Selector('#grade');
    const fallOption = semesterSelector.find('Fall');
    const ics390Option = nameSelector.find('ICS 390');
    const threeOption = creditsSelector.find('3');
    const inProgressOption = statusSelector.find('In Progress');
    const gradeOption = gradeSelector.find('TBD');
    await testController.click(semesterSelector);
    await testController.click(fallOption);
    await testController.click(nameSelector);
    await testController.click(ics390Option);
    await testController.click(creditsSelector);
    await testController.click(threeOption);
    await testController.click(statusSelector);
    await testController.click(inProgressOption);
    await testController.click(gradeSelector);
    await testController.click(gradeOption);

    await testController.click('#submit');
    await testController.click(Selector('.swal-button--confirm'));
  }
}

export const addCourseComponent = new AddCourseComponent();
