import type { Locator } from 'playwright/test';
import { expect, test } from '../init';
import { labels } from '../lib/labels';
import { Tags } from '../types';

const assertSliderSection = async (section: Locator) => {
  await section.scrollIntoViewIfNeeded();

  await expect(section.getByRole('heading', { level: 2 })).toBeVisible();

  const items = section.getByRole('list').getByRole('listitem');

  (await items.all()).forEach(async (item) => {
    const trigger = item.getByRole('button').or(item.getByRole('link'));

    await expect(trigger).toBeEnabled();
    await expect(trigger.getByRole('heading', { level: 3, name: /\w+/ })).toBeVisible();
    await expect(trigger.locator('img')).toBeVisible();
  });
};

test.describe('Scan home page', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.load();
  });

  test('Topstories', async ({ homePage }) => {
    await expect(homePage.topstories).toContainArticleItems(2);
  });

  test('Regular items', async ({ homePage }) => {
    const first = homePage.getRegularItems('first');
    await expect(first).toContainArticleItems(9);

    const second = homePage.getRegularItems('second');
    await expect(second).toContainArticleItems(6);

    const third = homePage.getRegularItems('third');
    await expect(third).toContainArticleItems(6);
  });

  test('Laatste nieuws', async ({ homePage }) => {
    const latestNewsBlock = homePage.page
      .getByRole('complementary')
      .filter({ has: homePage.page.getByRole('heading', { level: 2, name: labels.latestNews }) });

    await latestNewsBlock.scrollIntoViewIfNeeded();

    (await latestNewsBlock.getByRole('list').getByRole('listitem').all()).forEach(async (item) => {
      const link = item.getByRole('link');

      await expect(link).toBeEnabled();
      await expect(link).toContainText(/\w+/);
    });
  });

  test('Slider sections', { tag: Tags.JAVASCRIPT }, async ({ homePage, generic }) => {
    const { sliderSections } = homePage;

    expect(sliderSections).toHaveLength(5);

    for (const section of sliderSections) {
      await assertSliderSection(section);

      const scrollList = section.locator('.is-draggable');
      const navigationButtons = section.getByTestId('navigation-buttons');

      await expect(navigationButtons.getByLabel(labels.sliderPreviousSlideLabel)).not.toBeEnabled();
      await expect(navigationButtons.getByLabel(labels.sliderNextSlideLabel)).toBeEnabled();

      await generic.scrollListElementBy(scrollList, { percentage: 0.5 });

      await expect(navigationButtons.getByLabel(labels.sliderPreviousSlideLabel)).toBeEnabled();
      await expect(navigationButtons.getByLabel(labels.sliderNextSlideLabel)).toBeEnabled();

      await generic.scrollListElementBy(scrollList, { percentage: 0.5 });

      await scrollList.hover();

      await expect(navigationButtons.getByLabel(labels.sliderPreviousSlideLabel)).toBeEnabled();
      await expect(navigationButtons.getByLabel(labels.sliderNextSlideLabel)).not.toBeEnabled();
    }
  });

  /**
   * Assertions:
   * - STER banner is visible
   * - STER banner has a link
   * - STER banner can be accessed by keyboard
   */
  test.fixme('STER banner', async () => {});
});
