import { Selector } from 'testcafe';

class TranscriptPage {
  constructor() {
    this.pageId = '#transcript';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }
}

export const transcriptPage = new TranscriptPage();
