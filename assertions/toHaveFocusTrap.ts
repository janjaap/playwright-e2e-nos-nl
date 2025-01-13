/* eslint-disable @typescript-eslint/no-base-to-string,@typescript-eslint/restrict-template-expressions -- allow printing locators as string */
import { expect } from '@playwright/test';
import type { ExpectMatcherState, Locator, MatcherReturnType } from 'playwright/test';

import { focusableElements } from '../lib/locators';

export async function toHaveFocusTrap(this: ExpectMatcherState, locator: Locator): Promise<MatcherReturnType> {
  const assertionName = 'toHaveFocusTrap';
  let pass: boolean;

  const expected = true;
  const focusableElementsCount = await locator.locator(focusableElements).count();
  const activeElement = await locator.evaluate(() => document.activeElement);
  const locatorElement = await locator.evaluate((el) => el);

  try {
    for (let i = 0; i < focusableElementsCount * 1.5; i += 1) {
      await locator.press('Tab');
    }

    expect(locatorElement).toContain(activeElement);
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
