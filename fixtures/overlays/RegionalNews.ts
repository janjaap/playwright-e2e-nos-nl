import { labels } from '../../lib/labels';
import { BaseOverlayFixture } from './BaseOverlayFixture';

export class RegionalNews extends BaseOverlayFixture {
  get trigger() {
    return this.page.getByRole('button', { name: labels.regionalNewsOnboardingTitle });
  }

  get container() {
    return this.page.getByRole('dialog');
  }

  async hide() {
    const closeButton = this.container.getByRole('button', { name: labels.regionalNewsFormClose });

    if (await closeButton.isVisible()) {
      await closeButton.click();
    } else {
      await this.page.keyboard.press('Escape');
    }
  }
}
