import { Selector } from 'testcafe';

class ProgressPage {
  constructor() {
    this.pageId = '#progress-view';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }
}

export const progressPage = new ProgressPage();
