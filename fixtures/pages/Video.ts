import { labels } from '../../lib/labels';
import { Item } from './Item';

export class Video extends Item {
  async getMetadata() {
    const node = await this.page.locator('video').evaluateHandle((node: HTMLVideoElement) => node);
    const element = node.asElement();

    return element;

    // return { duration, currentTime, muted, paused };
  }

  get controls() {
    const playButton = this.page.getByRole('button', { name: labels.videoPlayButtonLabel }).first();
    const pauseButton = this.page.getByRole('button', { name: labels.videoPauseButtonLabel }).first();
    const muteButton = this.page.getByRole('button', { name: labels.videoMuteButtonLabel });
    const replayButton = this.page.getByRole('button', { name: labels.videoReplayButtonLabel });
    const fullScreenButton = this.page.getByRole('button', { name: labels.videoFullScreenButtonLabel });
    const progressBar = this.page.getByRole('slider', { name: labels.videoProgressBarLabel });

    return { playButton, pauseButton, replayButton, muteButton, fullScreenButton, progressBar };
  }
}
