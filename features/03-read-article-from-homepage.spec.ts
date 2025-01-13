import { expect, test } from '../init';
import { labels } from '../lib/labels';
import { Tags } from '../types';

test.describe('Read article from homepage', () => {
  test('Navigate to article item', { tag: Tags.KEYBOARD }, async ({ homePage, articlePage, baseURL }) => {
    await homePage.load();

    const randomArticle = await homePage.getRandomArticle();
    const href = (await randomArticle.getAttribute('href')) ?? '';
    const title = (await randomArticle.getByRole('heading').textContent()) as string;

    await homePage.interact(randomArticle);

    await expect(randomArticle).toBeFocused();

    await articlePage.page.waitForURL(href);

    await articlePage.load(articlePage.getItemId(href));

    expect(await articlePage.page.title()).toBe(title);

    await expect(articlePage.page.getByRole('heading', { name: title })).toBeVisible();

    if (await articlePage.isRegional()) {
      // assert two links; one external and one internal
      const broadcasterLink = articlePage.page.locator(`a[href]:has-text("${labels.regionalNewsArticleIndicator}")`);

      await expect(broadcasterLink).toBeExternalLink(
        // baseURL is defined in the config and is not empty
        baseURL!,
      );

      const regionalNewsOverviewLink = articlePage.page.locator(
        `a[href]:has-text("${labels.regionalNewsOverviewLabel}")`,
      );

      await expect(regionalNewsOverviewLink).not.toBeExternalLink(
        // baseURL is defined in the config and is not empty
        baseURL!,
      );
    }
  });
});
