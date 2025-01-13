import type { Locator } from 'playwright/test';
import { BasePageFixture } from './pages/BasePageFixture';

type ScrollByOptions = {
  /** The percentage of the parent's width to scroll the element by */
  percentage?: number;
  /** When scrolling, use the combined width of all the descendants instead of the width of the parent */
  takeDirectDescendants?: boolean;
  /** The direction in which to scroll the element */
  direction?: 'left-to-right' | 'right-to-left';
};

/**
 * Generic page fixture.
 * Extends the BasePageFixture and contains methods that are not specific to an individual page.
 */
export class Generic extends BasePageFixture {
  load(): Promise<void> {
    // The generic page does not have a specific URL to load
    throw new Error('Method not implemented.');
  }

  /**
   * Scrolls an element by a percentage of its (parent's) width
   * @param {Locator} parent The parent element; used to calculate the scrollable width. Must have a list as a direct child
   */
  async scrollListElementBy(parent: Locator, options: ScrollByOptions = {}) {
    const bbox = await parent.evaluate((parentElement) => parentElement.getBoundingClientRect());

    if (!bbox) {
      throw new Error('Element does not have a bounding box');
    }

    const { percentage = 1, takeDirectDescendants = true, direction = 'right-to-left' } = options;

    const pointInBox = {
      x: direction === 'right-to-left' ? Math.round(bbox.right) - 10 : Math.round(bbox.left + 10),
      y: Math.round(bbox.top + 10),
    };

    const element = parent.getByRole('list');

    const descendantsWidth = await element
      .locator('> *')
      .evaluateAll((children) =>
        children.map((child) => child.getBoundingClientRect().width).reduce((acc, width) => acc + width, 0),
      );

    const relativeWidth = Math.min(Math.max(percentage, 0), 1);
    const sourceWidth = takeDirectDescendants ? descendantsWidth : bbox.width;
    const steps = Math.round((sourceWidth * relativeWidth) / bbox.width);

    await Promise.all(
      // Take multiple steps to simulate a swipe; the full desired swipe distance cannot be reached
      // when the swipe distances is larger than the parent's width.
      Array(steps)
        .fill(null)
        .map(() => [
          this.page.mouse.move(pointInBox.x, pointInBox.y),
          this.page.mouse.down(),
          this.page.mouse.move(bbox.left, pointInBox.y),
          this.page.mouse.up(),
        ]),
    );
  }
}
