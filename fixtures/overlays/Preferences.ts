import { labels } from '../../lib/labels';
import { BaseOverlayFixture } from './BaseOverlayFixture';

export class Preferences extends BaseOverlayFixture {
  get trigger() {
    return this.page.getByRole('button', { name: labels.settingsOverlayTrigger });
  }

  get container() {
    return this.page.getByTestId('preferencesOverlay');
  }

  async hide() {
    const closeButton = this.container.locator(`button[aria-label="${labels.setttingsOverlayClose}"]`);

    if (await closeButton.isVisible()) {
      await this.interact(closeButton);
      return;
    }

    if (this.useOptions?.keyboardOnly) {
      await this.page.keyboard.press('Escape');
      return;
    }

    await this.clickOutside();
  }

  switchToDarkMode() {}

  switchToLightMode() {}

  switchToAutoMode() {}
}
