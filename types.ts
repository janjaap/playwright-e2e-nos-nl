import type {
  FullProject,
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions,
} from 'playwright/test';
import type { Generic } from './fixtures/Generic';
import type { HeaderImage } from './fixtures/overlays/HeaderImage';
import type { Preferences } from './fixtures/overlays/Preferences';
import type { Article } from './fixtures/pages/Article';
import type { Home } from './fixtures/pages/Home';
import type { Video } from './fixtures/pages/Video';

/**
 * Declarative configuration options.
 * @see https://playwright.dev/docs/test-fixtures#fixtures-options
 */
type Options = {
  /** Do (not) allow storing cookies. Default: false. */
  cookiesDisabled?: boolean;
  /** Limit interactions within a test to only the keyboard */
  keyboardOnly?: boolean;
};

/**
 * Automatic fixtures.
 * @see https://playwright.dev/docs/test-fixtures#automatic-fixtures
 */
type AutoFixtures = {
  /** Automatic fixture handling storage permissions */
  storage: () => void;
};

type Pages = {
  homePage: Home;
  articlePage: Article;
  videoPage: Video;
  /**
   * Generic fixture
   * Contains methods for functionality that are not specific to a page or overlay.
   */
  generic: Generic;
};

type Overlays = {
  /** Preference overlay */
  preferences: Preferences;
  /** Header image overlay */
  headerImage: HeaderImage;
};

export type UseOptions = FullProject['use'] & Options;

export type Fixtures = Options & AutoFixtures & Pages & Overlays;

export type AutomaticFixture = (
  args: Fixtures & PlaywrightTestArgs & PlaywrightTestOptions & PlaywrightWorkerArgs & PlaywrightWorkerOptions,
  use: (_r: () => void) => Promise<void>,
) => Promise<void>;

export type ItemType = 'article' | 'video' | 'livestream' | 'liveblog';

export type ItemIds = Record<ItemType, { test: number; prod: number }>;

/** Mark test or group of tests with a specific requirement to be run */
export enum Tags {
  /** Require javascript to pass */
  JAVASCRIPT = '@javascript',
  /** Require cookies to pass */
  COOKIES = '@cookies',
  /** Require keyboard navigation to pass */
  KEYBOARD = '@keyboard',
}
