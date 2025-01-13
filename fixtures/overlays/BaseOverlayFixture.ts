import type { Locator } from 'playwright/test';
import { BaseFixture } from '../BaseFixture';

export abstract class BaseOverlayFixture extends BaseFixture {
  /**
   * Returns the modal/containing element for the overlay's content
   */
  abstract get container(): Locator;

  /**
   * Returns the trigger element that opens the overlay
   */
  abstract get trigger(): Locator;

  /**
   * Hide the overlay and its contents
   */
  abstract hide(): Promise<void>;

  /**
   * Trigger a click outside the bounds of the overlay container
   */
  async clickOutside() {
    await this.page.click('body');
  }

  /**
   * Show the overlay by interacting with the trigger element
   */
  async show() {
    await this.interact(this.trigger);
  }
}
