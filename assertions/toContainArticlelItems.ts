/* eslint-disable @typescript-eslint/no-base-to-string,@typescript-eslint/restrict-template-expressions -- allow printing locators as string */
import type { ExpectMatcherState, Locator, MatcherReturnType } from 'playwright/test';
import { expect } from 'playwright/test';

export async function toContainArticleItems(
  this: ExpectMatcherState,
  locator: Locator,
  expectedNumberOfArticles: number,
  headingLevel = 2,
): Promise<MatcherReturnType> {
  const assertionName = 'toContainArticleItems';
  let pass: boolean;

  const expected = true;

  try {
    await expect(locator).toHaveCount(expectedNumberOfArticles);

    (await locator.all()).forEach(async (item) => {
      const link = item.getByRole('link');

      await expect(link).toBeEnabled();
      await expect(link).toContainText(/\w+/);
      await expect(link.getByRole('heading', { level: headingLevel, name: /\w+/ })).toBeVisible();
      await expect(link.locator('img')).toBeVisible();
    });

    pass = true;
  } catch {
    pass = false;
  }

  const message = () => `
${this.utils.matcherHint(assertionName, locator, undefined, { isNot: this.isNot })}

Locator: ${locator}
Expected: ${pass ? 'not ' : ''}${this.utils.printExpected(expected)}
    `;

  return {
    message,
    pass,
    name: assertionName,
    expected,
  };
}
