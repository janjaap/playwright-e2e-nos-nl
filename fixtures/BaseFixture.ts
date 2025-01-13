import type { Locator, Page } from 'playwright/test';
import type { UseOptions } from '../types';

import { AxeBuilder } from '@axe-core/playwright';

/**
 * Base class for all fixtures
 */
export abstract class BaseFixture {
  readonly page: Page;
  readonly useOptions?: UseOptions;
  readonly builder: AxeBuilder;
  // https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#axe-core-tags
  readonly axeCoreTags = [
    'best-practice',
    'cat.keyboard',
    'cat.semantics',
    'cat.structure',
    'cat.text-alternatives',
    'wcag21a',
    'wcag21aa',
    'wcag22a',
    'wcag22aa',
  ];

  constructor(page: Page, useOptions?: UseOptions) {
    this.page = page;
    this.useOptions = useOptions;
    this.builder = new AxeBuilder({ page }).withTags(this.axeCoreTags);
  }

  async getViolations(extraTags: string[] = []) {
    this.builder.withTags(this.axeCoreTags.concat(extraTags));

    const { violations } = await this.builder.analyze();
    const critical = violations.filter((violation) => violation.impact === 'critical');
    const serious = violations.filter((violation) => violation.impact === 'serious');
    const moderate = violations.filter((violation) => violation.impact === 'moderate');
    const minor = violations.filter((violation) => violation.impact === 'minor');

    return { critical, serious, moderate, minor };
  }

  getActiveElement = async () => await this.page.evaluate(() => document.activeElement);

  /**
   * Performs a click action on an element regardless of input method
   */
  async interact(locator: Locator) {
    if (this.useOptions?.hasTouch) {
      await locator.tap();
      return;
    }

    if (this.useOptions?.keyboardOnly) {
      await this.tabTo(locator);
      await this.keyPress('Enter');
      return;
    }

    await locator.click();
  }

  /**
   * Presses the Tab key for a specified number of times
   */
  async tabNext(repeat = 1) {
    await this.keyPress('Tab', repeat);
  }

  /**
   * Presses the Shift+Tab key combination for a specified number of times
   */
  async tabPrevious(repeat = 1) {
    await this.keyPress('Shift+Tab', repeat);
  }

  /**
   * Presses the Tab key until the specified element is focused
   */
  async tabTo(locator: Locator) {
    while (await locator.evaluate((node) => document.activeElement !== node)) {
      await this.tabNext();
    }
  }

  /**
   * Presses a key for a specified number of times
   */
  async keyPress(key: string, repeat = 1) {
    for (let i = 0; i < repeat; i += 1) {
      await this.page.keyboard.press(key);
    }
  }
}
