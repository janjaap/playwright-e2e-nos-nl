/* eslint-disable @typescript-eslint/no-base-to-string,@typescript-eslint/restrict-template-expressions -- allow printing locators as string */
import { expect } from '@playwright/test';
import type { ExpectMatcherState, Locator, MatcherReturnType } from 'playwright/test';

export async function toHaveDropdown(this: ExpectMatcherState, locator: Locator): Promise<MatcherReturnType> {
  const assertionName = 'toHaveDropdown';
  let pass: boolean;
  const expected = true;

  try {
    await expect(locator).toBeEnabled();

    const submenu = locator.locator('+ ul[role="menu"]');

    await expect(submenu).not.toBeVisible();

    await locator.hover();

    await expect(submenu).toBeVisible();

    (await submenu.getByRole('link').all()).forEach(async (link) => {
      await expect(link).toBeEnabled();

      const linkText = await link.textContent();

      expect(linkText).not.toBeNull();
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
