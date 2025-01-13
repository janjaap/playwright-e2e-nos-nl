import { getRandomFromArray } from '../../lib/getRandom';
import { BasePageFixture } from './BasePageFixture';

const articleSections = ['topstories', 'first-regular-items', 'second-regular-items', 'third-regular-items'];

/**
 * Home page fixture.
 * Extends the BasePageFixture class and contains methods specific to functionality on the home page.
 */
export class Home extends BasePageFixture {
  /**
   * Loads the Home page by navigating to the specified URL.
   */
  async load() {
    await this.page.goto(this.route);
  }

  /**
   * Gets the list items within the 'topstories' container.
   */
  get topstories() {
    return this.getListItemsByContainerTestId('topstories');
  }

  /**
   * Gets the slider sections on the Home page.
   */
  get sliderSections() {
    const sliderSections = ['kijken', 'uitgelegd', 'sport', 'gemist', 'collecties'];

    return sliderSections.map((sectionName) => this.page.getByTestId(`slider-section-${sectionName}`));
  }

  /**
   * Gets a random article from a random article section.
   */
  async getRandomArticle() {
    const articlesInSection = await this.page.getByTestId(getRandomFromArray(articleSections)).getByRole('link').all();

    return getRandomFromArray(articlesInSection);
  }

  /**
   * Gets the regular items within a specified container.
   */
  getRegularItems(testId: 'first' | 'second' | 'third') {
    return this.getListItemsByContainerTestId(`${testId}-regular-items`);
  }
}
