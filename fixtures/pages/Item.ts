import path from 'path';
import { labels } from '../../lib/labels';
import type { ItemType } from '../../types';
import { BasePageFixture } from './BasePageFixture';

/**
 * Article page fixture.
 * Extends the BasePageFixture class and contains methods specific to functionality on the article page.
 */
export abstract class Item extends BasePageFixture {
  // Path regex        /<type>/<id>-<slug>
  readonly hrefRe = /\/(\w+)\/(\d+)-(.+)\/?$/;

  /**
   * Load the article page and, optionally, mock the load.
   * @see https://playwright.dev/docs/mock#mocking-with-har-files
   */
  async load(itemId: number, mockLoad = false) {
    if (mockLoad) {
      await this.page.routeFromHAR(path.resolve(__dirname, `../../hars/${this.name}.har`), {
        notFound: 'fallback',
      });
    }

    await this.page.goto(this.route.replace('**', itemId.toString()));
  }

  private getHrefParts() {
    const [_fullMatch, type, id, slug] = this.page.url().match(this.hrefRe) ?? [];

    return { type: type as ItemType, id, slug };
  }

  private get type() {
    const { type } = this.getHrefParts();

    switch (type) {
      case 'video':
      case 'livestream':
      case 'liveblog':
        return type;
      default:
        return 'article';
    }
  }

  async isRegional() {
    if (this.type !== 'article') return false;

    const colabElements = this.page.getByText(labels.regionalNewsArticleIndicator);

    return (await colabElements.count()) > 0;
  }

  getItemId(href: string) {
    const { id } = this.getHrefParts();

    if (Number.isNaN(+id)) {
      throw new Error(`Failed to extract item ID from ${href}`);
    }

    return +id;
  }
}
