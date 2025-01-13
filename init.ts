import type { Fixtures } from './types';

import { expect as baseExpect, test as baseTest } from '@playwright/test';
import { toBeExternalLink } from './assertions/toBeExternalLink';
import { toContainArticleItems } from './assertions/toContainArticlelItems';
import { toHaveDropdown } from './assertions/toHaveDropdown';
import { toHaveFocusTrap } from './assertions/toHaveFocusTrap';
import { storage } from './fixtures/automatic/storage';
import { Generic } from './fixtures/Generic';
import { HeaderImage } from './fixtures/overlays/HeaderImage';
import { Preferences } from './fixtures/overlays/Preferences';
import { Article } from './fixtures/pages/Article';
import { Home } from './fixtures/pages/Home';
import { Video } from './fixtures/pages/Video';

export const test = baseTest.extend<Fixtures>({
  /**
   * Options
   * @see https://playwright.dev/docs/test-fixtures#fixtures-options
   */
  cookiesDisabled: [false, { option: true }],
  keyboardOnly: [false, { option: true }],

  /**
   * Fixtures
   * @see https://playwright.dev/docs/test-fixtures#with-fixtures
   */
  // pages
  homePage: [async ({ page }, use) => use(new Home(page)), { box: true }],

  articlePage: [async ({ page }, use) => use(new Article(page)), { box: true }],

  videoPage: [async ({ page }, use) => use(new Video(page)), { box: true }],

  generic: [async ({ page }, use, { project }) => use(new Generic(page, project.use)), { box: true }],

  // overlays
  preferences: [async ({ page }, use) => use(new Preferences(page)), { box: true }],

  headerImage: [async ({ page }, use) => use(new HeaderImage(page)), { box: true }],

  /**
   * Automatic fixtures.
   * @see https://playwright.dev/docs/test-fixtures#automatic-fixtures
   */
  storage: [storage, { auto: true, box: true }],
});

export const expect = baseExpect.extend({
  /**
   * Ensures that a container element has keyboard focus trap.
   *
   * **Usage**
   *
   * ```js
   * await expect(page.getByTestId('modal')).toHaveFocusTrap();
   * ```
   */
  toHaveFocusTrap,

  /**
   * Asserts that the locator argument has a link as child element that has a href attribute that is not part of the base url.
   *
   * **Usage**
   *
   * ```js
   * const link = page.getByRole('link', { name: 'external-link' });
   * const originComparisonUrl = 'https://example.com';
   * await expect(link).toBeExternalLink(originComparisonUrl);
   * ```
   */
  toBeExternalLink,

  /**
   * Asserts that the locator argument has a dropdown menu with links as items.
   *
   * **Usage**
   *
   * ```js
   * const mainNavigation = page.getByRole('navigation', { name: 'Main navigation' });
   *
   * await expect(mainNavigation.getByRole('link', { name: 'News' })).toHaveDropdown();
   * ```
   */
  toHaveDropdown,

  /**
   * Asserts that the locator argument has a list of article items.
   *
   * **Usage**
   *
   * ```js
   * // Asserted list has to contain a specific number of articles
   * const expectedNumberOfArticles = 5;
   *
   * // Each article item has to have a heading with a specific level
   * const headingLevel = 3;
   *
   * const articleList = page.getByRole('list', { name: 'Article list' });
   *
   * await expect(articleList).toContainArticleItems(expectedNumberOfArticles, headingLevel);
   * ```
   */
  toContainArticleItems,
});
