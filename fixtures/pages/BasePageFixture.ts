import type { Page } from 'playwright/test';
import { routes } from '../../data';
import { labels } from '../../lib/labels';
import type { UseOptions } from '../../types';
import { BaseFixture } from '../BaseFixture';

/**
 * Base class for all page fixtures.
 * Contains methods that are common to all page fixtures.
 */
export abstract class BasePageFixture extends BaseFixture {
  readonly route: string;
  readonly name: string;

  constructor(page: Page, useOptions?: UseOptions) {
    super(page, useOptions);
    this.name = this.constructor.name.toLowerCase();
    this.route = routes[this.name as keyof typeof routes];
  }

  protected getListItemsByContainerTestId(testId: string) {
    return this.page.getByTestId(testId).getByRole('listitem');
  }

  /** Go to the page's URL and wait for DOMContentLoaded event  */
  abstract load(itemId?: string | number): Promise<void>;

  makeScreenshot = async (fullPage = true) =>
    await this.page.screenshot({
      path: `screenshots/${this.name}-page.png`,
      fullPage,
    });

  /**
   * Locate the skip to content link and activate it
   */
  async skipToContent() {
    const skipToContentLink = this.page.getByRole('link', { name: labels.contentSkipLink });

    await skipToContentLink.focus();
    await this.page.keyboard.press('Enter');
  }

  /**
   * Waits for the cookie banner to be loaded
   * Do note that this is 3rd party content and the test might fail at any time
   */
  async waitForCookieBanner() {
    const requestPromise = this.page.waitForRequest(/cookies\.nos\.nl\/sites\/NOS\/nos\.nl\/ccm-bar-nl\.html/);

    const cookieBanner = this.page.locator('#ccm_notification');

    await requestPromise;

    return cookieBanner;
  }
}
