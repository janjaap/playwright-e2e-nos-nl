/* eslint-disable @typescript-eslint/no-base-to-string,@typescript-eslint/restrict-template-expressions -- allow printing locators as string */
import { expect, type ExpectMatcherState, type Locator, type MatcherReturnType } from 'playwright/test';

export async function toBeExternalLink(
  this: ExpectMatcherState,
  locator: Locator,
  originComparisonUrl: string,
): Promise<MatcherReturnType> {
  const assertionName = 'toBeExternalLink';
  let pass: boolean;

  const expected = true;

  try {
    const href = await locator.getAttribute('href');

    expect(href?.startsWith('/')).toBe(false);
    expect(href).not.toContain(originComparisonUrl);
    pass = true;
  } catch {
    pass = false;
  }

  const message = () => `
${this.utils.matcherHint(assertionName, locator, undefined, { isNot: this.isNot })}

Locator: ${locator}
Expected: ${pass ? 'not ' : ''} to be external link
    `;

  return {
    message,
    pass,
    name: assertionName,
    expected,
  };
}
