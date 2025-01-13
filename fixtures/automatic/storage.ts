import type { AutomaticFixture } from '../../types';

export const storage: AutomaticFixture = async ({ page, cookiesDisabled }, use) => {
  if (cookiesDisabled) {
    await page.addInitScript(() => {
      Object.defineProperty(Object.getPrototypeOf(navigator), 'cookieEnabled', { value: false });

      Object.defineProperty(document, 'cookie', {
        get: () => '',
        set: () => undefined,
      });
    });
  }

  await use(() => {});
};
