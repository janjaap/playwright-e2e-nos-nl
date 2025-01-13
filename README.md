# Playwright setup for NOS.nl

The end-to-end testing setup is built using
[Playwright](https://playwright.dev). Playwright provides resilient,
auto-waiting, web-first assertions with built-in tracing for visual comparisons
and debugging. Its inspector enables the generation of selectors and
live-debugging of pages under test. Additionally, it supports accessibility
testing for components, sections, or full pages, though this feature is somewhat
less reliable.

[Best practices](https://playwright.dev/docs/best-practices) are followed
wherever possible.

## Structure

Playwright offers two ways of setting up the tests structure;
[POM (Page object models)](https://playwright.dev/docs/pom) and
[fixtures](https://playwright.dev/docs/test-fixtures). Both fixtures and page
object models contain functionality that is unique or limited to a page. The
main difference is where the configuration is located and
[how this configuration is applied](https://playwright.dev/docs/test-fixtures#with-fixtures)
in test cases.

### Benefits of fixtures over Page Object Models

- **Encapsulation**: Fixtures integrate setup and teardown in one place.
- **Reusability**: Fixtures can be reused across test files.
- **Efficiency**: Fixtures are on-demand; Playwright only sets up the fixtures
  needed for a test.
- **Flexibility**: Fixtures are composable and simplify test grouping,
  eliminating the need to configure tests individually.

This end-to-end setup primarily relies on fixtures while incorporating POM
principles where appropriate.

## Separation of concerns

To maintain clear separation of concerns, the end-to-end setup is organized into
the following components:

### Features

User-centered test cases that describe the flows (happy paths) visitors take to
achieve their goals on the website.

> [!NOTE] Feature files should focus on user behavior rather than merely
> scanning for visible or available elements. Element verification is better
> suited for unit or integration tests (e.g., using Jest). Prioritizing user
> behavior enhances the validation of semantic structures and accessible
> functionality.

#### Tagging

Features [can be tagged](https://playwright.dev/docs/test-annotations#tag-tests)
to indicate their dependency on specific
[project settings](https://playwright.dev/docs/api/class-testconfig#test-config-projects).

For example:

- A test tagged with `@javascript` will be skipped if the test run is configured
  without JavaScript.
- Similar tagging applies to `@keyboard` and `@cookies`.

Feature files contain assertions to verify the functionality of pages and their
components.

### Fixtures

Fixtures are Playwright’s way to build up and teardown state outside of the test
itself. Using fixtures, all resources can be accessed directly in tests without
having to go through the setup process every time.

Utility classes contain methods specific to individual pages in the application.
Shared functionality, such as main and footer navigation or banners, is grouped
into a `Generic` fixture.

Fixtures:

- Do not contain assertions
- Provide getters to facilitate assertions in feature files.

### Assertions

[Custom assertions](https://playwright.dev/docs/test-assertions#add-custom-matchers-using-expectextend)
that extend
[the default set of assertions](https://playwright.dev/docs/test-assertions)
that Playwright offers. At the time of writing, the following custom assertions
are available:

- **toBeExternalLink**: asserts that an anchor element points to a URL outside
  of the base URL.
- **toContainArticleItems**: asserts that a container has a list of links that
  each contain text as well as an image.
- **toHaveDropDown**: asserts that an element is interactive and is followed by
  a list that is shown when the element is interacted with.
- **toHaveFocusTrap**: asserts that an element contains the keyboard focus when
  tabbing.

## Mocking data

With Playwright, both
[API calls and entire (or partial) network requests can be mocked](https://playwright.dev/docs/mock)
and provided with desired response data. What Playwright cannot do is mock
server side requests and responses which limits the way tests are run against a
specific environment; each page consists of statically generated content which
is embedded in the response. This makes it quite hard to mock only parts of a
page.

What Playwright can do is
[mock some or all network requests by means of HARS](https://playwright.dev/docs/mock#mocking-with-har-files).
This means that multiple requests can be mocked in a single call. See for
instance the way article and video pages can be loaded.

## Accessibility

As an example of how Playwright can handle testing for accessibility, the
[@axe-core/playwright](https://www.npmjs.com/package/@axe-core/playwright)
dependency has been added. The reliability of the tests, however, is nog
something that can be gone into blindly. From all the possible accessibility
issues, roughly
[ten percent might be captured](https://equalentry.com/digital-accessibility-automated-testing-tools-comparison/).
The results can serve as an indicator.
