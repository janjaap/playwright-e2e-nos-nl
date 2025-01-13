import type { Request } from 'playwright/test';

import { format } from 'date-fns';
import { getItemId, nieuws, sport } from '../data';
import { expect, test } from '../init';
import { labels } from '../lib/labels';
import { Tags } from '../types';

test.describe('Generic', { tag: Tags.JAVASCRIPT }, () => {
  test.describe('Accessibility', () => {
    test('Home', async ({ homePage }, testInfo) => {
      test.setTimeout(testInfo.timeout + 30_000);

      await homePage.load();
      const { critical, serious } = await homePage.getViolations();

      expect(critical).toHaveLength(0);
      expect(serious).toHaveLength(0);
    });

    test('Article', async ({ articlePage }) => {
      const articleId = getItemId('article');
      await articlePage.load(articleId);
      const { critical, serious } = await articlePage.getViolations();

      expect(critical).toHaveLength(0);
      expect(serious).toHaveLength(0);
    });
  });

  /**
   * Assertions:
   * - SmartOcto's Tentacles loaded and initiated
   */
  test('SmartOcto', async ({ homePage }) => {
    const logs: Array<string> = [];

    homePage.page.on('console', (msg) => {
      if (msg.type() === 'log') {
        logs.push(msg.text());
      }
    });

    await homePage.load();
    await homePage.page.waitForURL(homePage.route, { waitUntil: 'networkidle' });

    expect(logs).toEqual(
      expect.arrayContaining([
        'IngestionApi loaded...',
        "smartocto's Tentacles loaded...",
        'Tentacles is initiating Index Page',
      ]),
    );
  });

  /**
   * Assertions:
   * - Ster banner script is loaded
   */
  test('STER banner', async ({ homePage }) => {
    const bannerUrls: Array<string> = [];

    const pushUrl = (request: Request) => {
      if (request.url().includes('adcdn.ster.nl')) {
        bannerUrls.push(request.url());
      }
    };

    homePage.page.on('request', pushUrl);

    await homePage.load();

    expect(bannerUrls).toEqual(expect.arrayContaining(['https://adcdn.ster.nl/script/nos.homepage.min.js']));
  });

  /**
   * Assertions:
   * - is always visible after page load
   * - is hidden after clicking the close button
   */
  test('cookie banner', async ({ generic, homePage }) => {
    await homePage.load();

    const cookieBanner = await generic.waitForCookieBanner();

    await expect(cookieBanner).toBeVisible();

    await cookieBanner.getByRole('button', { name: labels.cookieBannerClose }).click();

    await expect(cookieBanner).not.toBeVisible();
  });

  /**
   * Assertions:
   * - Nieuws and Sport dropdowns:
   *   - are hidden by default
   *   - are visible after clicking the trigger
   *   - contains link elements with correct text and href
   */
  test('Main navigation', async ({ homePage }) => {
    await homePage.load();

    const mainNavigation = homePage.page.getByRole('navigation', { name: labels.mainNavigation });

    await expect.soft(mainNavigation).toMatchAriaSnapshot(`
      - list:
        - listitem:
          - link "Homepage"
        - listitem:
          - link "Live"
        - listitem:
          - link "Programma's"
      - list:
        - listitem:
          - link "Weer"
        - listitem:
          - link "Zoeken"
        - listitem:
          - link "NPO Start"
        - listitem:
          - button "Andere NOS sites"
    `);

    await expect(mainNavigation.getByRole('link', { name: 'Nieuws' })).toHaveDropdown();

    await expect.soft(mainNavigation).toMatchAriaSnapshot(`
      - list:
        - listitem:
          - link "Nieuws" [expanded]
          - menu:
            ${nieuws
              .map(
                (item) => `
            - menuitem "${item}":
              - link "${item}"
            `,
              )
              .join('\n')}
    `);

    await expect(mainNavigation.getByRole('link', { name: 'Sport' })).toHaveDropdown();

    await expect.soft(mainNavigation).toMatchAriaSnapshot(`
      - list:
        - listitem:
          - link "Sport" [expanded]
          - menu:
            ${sport
              .map(
                (item) => `
            - menuitem "${item}":
              - link "${item}"
            `,
              )
              .join('\n')}
    `);
  });

  test('Footer navigation', async ({ homePage }) => {
    await homePage.load();

    const footer = homePage.page.getByRole('contentinfo');

    await expect.soft(footer).toMatchAriaSnapshot(`
      - contentinfo:
        - heading "NOS informatie" [level=2]
        - list:
          - listitem:
            - link "Over de NOS"
          - listitem:
            - link "Werken bij de NOS"
          - listitem:
            - link "Contact"
          - listitem:
            - link "Journalistieke verantwoording"
          - listitem:
            - link "Herstelrubriek"
          - listitem:
            - link "Ombudsman NPO"
          - listitem:
            - link "NOS Apps"
          - listitem:
            - link "Privacy"
        - heading "Nieuws" [level=2]
        - list:
          ${nieuws
            .map(
              (item) => `
          - listitem:
            - link "${item}"
        `,
            )
            .join('\n')}
        - heading "Sport" [level=2]
        - list:
          ${sport
            .map(
              (item) => `
          - listitem:
            - link "${item}"
          `,
            )
            .join('\n')}
        - button "Geef ons feedback Vertel ons wat je van onze site vindt":
          - img
          - text: Geef ons feedback Vertel ons wat je van onze site vindt
        - link "Tip de redactie Geef je tips aan ons door":
          - img
          - text: Tip de redactie Geef je tips aan ons door
        - link "Publieksvoorlichting Voor vragen en reacties":
          - img
          - text: Publieksvoorlichting Voor vragen en reacties
        - link "Link naar de homepage":
          - img "Link naar de homepage"
        - link "Ga naar het NOS X account":
          - img
        - link "Ga naar het NOS Facebook account":
          - img
        - link "Ga naar het NOS Instagram account":
          - img
        - link "Ga naar het NOS Youtube account":
          - img
        - text: © NOS 2025
        - link "Cookies"
        - link "Voorwaarden"
      `);
  });

  /**
   * Assertions:
   * - is hidden by default
   * - is visible after clicking the trigger
   * - is hidden after clicking the close button
   * - contains focus trap
   * - restores foucs to the trigger after closing
   */
  test('Preferences overlay', async ({ preferences, homePage }) => {
    await homePage.load();

    await homePage.tabTo(preferences.trigger);

    await expect(preferences.container).not.toBeVisible();

    await expect(preferences.trigger).toBeFocused();

    await homePage.interact(preferences.trigger);

    await expect(preferences.container).toBeVisible();

    await expect(preferences.container).toHaveFocusTrap();

    await preferences.hide();

    await expect(preferences.container).not.toBeVisible();

    await expect(preferences.trigger).toBeFocused();
  });

  test('Regionaal nieuws onboarding', { tag: Tags.COOKIES }, async ({ homePage, context }, { project }) => {
    const baseURL = new URL(project.use.baseURL ?? '');

    await context.addCookies([
      {
        name: 'Cookie_Consent',
        value: format(new Date(), 'PPPPpppp'),
        // Tue Nov 26 2024 16:24:46 GMT+0100 (Central European Standard Time)
        domain: 'localhost',
        expires: -1,
        httpOnly: false,
        path: '/',
        secure: false,
        sameSite: 'Lax',
      },
      {
        name: 'nos_regionNotificationData',
        value: encodeURIComponent(
          JSON.stringify({
            showNotification: true,
            dismissedLarge: false,
            ignoredLargeCount: 0,
            dismissedSmall: false,
            ignoredSmallCount: 0,
          }),
        ),
        domain: baseURL.hostname,
        path: baseURL.pathname,
      },
    ]);

    await homePage.load();

    const kiesJeOmroepButton = homePage.page.getByRole('button', { name: labels.regionalNewsOnboardingTitle });

    await expect(kiesJeOmroepButton).toBeVisible();

    await kiesJeOmroepButton.click();

    await expect(
      homePage.page.getByRole('dialog').getByRole('heading', { level: 1, name: labels.regionalNewsFormTitle }),
    ).toBeVisible();

    await expect(homePage.page.getByRole('dialog')).toHaveFocusTrap();
  });

  test.fixme('Color scheme preferences', async () => {});
});
