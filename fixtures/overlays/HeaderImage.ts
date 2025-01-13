import { labels } from '../../lib/labels';
import { BaseOverlayFixture } from './BaseOverlayFixture';

export class HeaderImage extends BaseOverlayFixture {
  get trigger() {
    return this.page
      .locator('figure')
      .getByRole('button')
      .filter({
        has: this.page.getByRole('img'),
      })
      .first();
  }

  get container() {
    return this.page.getByTestId('modal');
  }

  async hide() {
    const closeButton = this.container.locator(`button[aria-label="${labels.setttingsOverlayClose}"]`);

    if (await closeButton.isVisible()) {
      await closeButton.click();
    } else {
      await this.page.keyboard.press('Escape');
    }
  }
}
