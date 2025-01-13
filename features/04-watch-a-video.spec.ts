import { getItemId } from '../data';
import { expect, test } from '../init';
import { Tags } from '../types';

test.describe('Watch a video', () => {
  test.beforeEach(async ({ videoPage }) => {
    const videoId = getItemId('video');

    if (!videoId) {
      throw new Error('No videoId provided');
    }

    await videoPage.load(videoId, true);
  });

  test('User can watch a video', { tag: Tags.JAVASCRIPT }, async ({ videoPage }) => {
    const { playButton, pauseButton, replayButton, muteButton, fullScreenButton, progressBar } = videoPage.controls;

    await expect(playButton).toBeEnabled();
    await expect(muteButton).not.toBeAttached();
    await expect(fullScreenButton).not.toBeAttached();
    await expect(progressBar).not.toBeAttached();
    await expect(pauseButton).not.toBeAttached();

    await videoPage.interact(playButton);

    await expect(muteButton).toBeEnabled();
    await expect(fullScreenButton).toBeEnabled();
    await expect(progressBar).toBeEnabled();
    await expect(pauseButton).toBeEnabled();

    await videoPage.interact(pauseButton);

    await videoPage.tabNext();

    await expect(replayButton).not.toBeAttached();

    await videoPage.keyPress('ArrowRight', 10);

    await expect(replayButton).toBeEnabled();
  });
});
