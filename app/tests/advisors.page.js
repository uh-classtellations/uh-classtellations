import { Selector } from 'testcafe';

class AdvisorsPage {
  constructor() {
    this.pageId = '#advisors-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }
}

export const advisorsPage = new AdvisorsPage();
