import { expect, test } from '../init';
import { Tags } from '../types';

test.describe('Enter via deeplink', () => {
  test('Scan article page', { tag: Tags.JAVASCRIPT }, async ({ articlePage, generic, headerImage, viewport }) => {
    await articlePage.load(2547635);

    await generic.skipToContent();

    await articlePage.tabNext();

    await expect(headerImage.trigger).toBeFocused();

    await headerImage.show();

    const headerImageHeight = await headerImage.container.locator('img').evaluate(({ clientHeight }) => clientHeight);

    expect(headerImageHeight).toEqual(viewport?.height);

    await headerImage.hide();
  });
});
