// cSpell: words duckhunt

/**
 * Generate a random slope
 *
 * @returns number
 */
const randomSlope = () => Math.atan(Math.random() * 90);

const duckhunt = (callback?: () => void) => {
  let bullets = 3;
  const frameTimeout = 100; // the number of animation cycles that occur before the ducks fly away
  const duckWidth = 145; // px
  const duckHeight = 145; // px
  const sprite = [0, -145, -290]; // first,second,third animation frame
  const duckOrientation = [0, -145, -290]; // horizontal,diagonally,vertically duck duckOrientation

  // outer overlay
  const overlayOuter = document.body.appendChild(document.createElement('div'));
  overlayOuter.className = 'duckhunt-overlay';

  // inner overlay
  const overlay = overlayOuter.appendChild(document.createElement('div'));

  /**
   * Random point within 80% of window width.  10% on either side for padding
   *
   * @returns number
   */
  const randomLeftOffset = () => (
    Math.round(Math.random() * overlay.offsetWidth * 0.8) + (overlay.offsetWidth * 0.1)
  );

  interface IDuck {
    e: HTMLElement,
    spriteNum:number,
    duckOrientationNum:number,
    slopeX: number,
    slopeY:number,
    shot:boolean,
    finished:boolean,
    topOffset:number,
    leftOffset:number,
  }

  // duck objects
  const duck1: IDuck = {
    e: overlay.appendChild(document.createElement('div')),
    spriteNum: 0,
    duckOrientationNum: 1,
    slopeX: randomSlope(),
    slopeY: 0,
    shot: false,
    finished: false,
    topOffset: overlay.offsetHeight,
    leftOffset: randomLeftOffset(),
  };
  const duck2: IDuck = {
    e: overlay.appendChild(document.createElement('div')),
    spriteNum: 0,
    duckOrientationNum: 0,
    slopeX: -randomSlope(),
    slopeY: 0,
    shot: false,
    finished: false,
    topOffset: overlay.offsetHeight,
    leftOffset: randomLeftOffset(),
  };

  const dog = overlay.appendChild(document.createElement('div'));

  /**
   * Fly away animation sequence that will continue to the dog animation
   * when complete
   *
   * @param duckId string
   */
  const duckFlyawayFrame = (duckId: string) => {
    const duck = (duckId === 'duck1') ? duck1 : duck2;
    // update position
    duck.topOffset -= 15;
    duck.e.style.top = `${duck.topOffset}px`;

    // update sprite
    duck.spriteNum = ((duck.spriteNum === 2) ? 0 : duck.spriteNum + 1);
    duck.e.style.backgroundPosition = `${sprite[duck.spriteNum]}px ${duckOrientation[duck.duckOrientationNum]}px`;

    // If the duck has not reached the top of the screen
    if (duck.topOffset > -duckHeight) {
      // lather, rinse, repeat
      setTimeout(() => { duckFlyawayFrame(duckId); }, 50);
    } else {
      // Woof
      duck.finished = true;

      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      dogStart();
    }
  };

  /**
   * Determine the spriteNum for a given duck Id
   *
   * @param duckId string
   * @returns number
   */
  const duckSpriteNum = (duckId: string) => {
    const duck = (duckId === 'duck1') ? duck1 : duck2;
    return (duck.spriteNum === 2) ? 0 : duck.spriteNum + 1;
  };

  /**
   * Updates the animation frame and determines if fly away sequence
   * should begin
   *
   * @param duckId string
   * @param frameNum number
   */
  const duckFlapFrame = (duckId: string, frameNum: number) => {
    const duck = (duckId === 'duck1') ? duck1 : duck2;
    // If this duck been shot
    if (duck.shot) {
      return;
    }
    // Has this duck not been shot and the timeout has been reached
    // or are there no more bullets?
    if (frameNum > frameTimeout || bullets <= 0) {
      // fly away
      duck.duckOrientationNum = 2;
      duckFlyawayFrame(duckId);
      return;
    }
    // When hitting the edge of the screen, the duck should
    // reverse direction and at random but natural slope

    // right side of screen
    if (duck.leftOffset >= (overlay.offsetWidth - duckWidth)) {
      duck.e.className = 'duckhunt-sprites duckhunt-duck duckhunt-hoz-flip';
      duck.slopeX = -randomSlope();
    } else if (duck.leftOffset <= 0) {
      // left side of screen
      duck.e.className = 'duckhunt-sprites duckhunt-duck';
      duck.slopeX = randomSlope();
    }
    // top
    if (duck.topOffset <= 0) {
      duck.slopeY = randomSlope();
      duck.duckOrientationNum = ((duck.slopeX / duck.slopeY) < 1.03) ? 0 : 1;
    } else if (duck.topOffset >= (overlay.offsetHeight - duckHeight)) {
      // bottom
      duck.slopeY = -randomSlope();
      duck.duckOrientationNum = ((duck.slopeX / duck.slopeY) < 1.03) ? 0 : 1;
    }

    // update position
    duck.topOffset += (duck.slopeY * 8);
    duck.leftOffset += (duck.slopeX * 8);
    duck.e.style.top = `${duck.topOffset}px`;
    duck.e.style.left = `${duck.leftOffset}px`;

    // update sprite
    duck.spriteNum = duckSpriteNum(duckId);
    duck.e.style.backgroundPosition = `${sprite[duck.spriteNum]}px ${duckOrientation[duck.duckOrientationNum]}px`;

    // lather, rinse, repeat
    setTimeout(() => { duckFlapFrame(duckId, frameNum + 1); }, 50);
  };

  /**
   * The diving animation sequence after a duck has been shot and will
   * continue to the dog animation when complete
   *
   * @param duckId string
   * @param flip boolean
   */
  const duckShotFrame = (duckId: string, flip: boolean) => {
    const duck = (duckId === 'duck1') ? duck1 : duck2;
    duck.e.className = flip ? 'duckhunt-sprites duckhunt-duck duckhunt-hoz-flip' : 'duckhunt-sprites duckhunt-duck';
    duck.topOffset += 30;
    duck.e.style.top = `${duck.topOffset}px`;

    // If the top of the duck sprite has not reached the bottom of the overlay
    if (duck.topOffset < (overlay.offsetHeight + duckHeight)) {
      // lather, rinse, repeat
      setTimeout(() => { duckShotFrame(duckId, !flip); }, 50);
    } else {
      // Woof
      duck.finished = true;

      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      dogStart();
    }
  };

  /**
   * Verify duck can be shot and show sprite that briefly appears
   * between flash and the diving sequence
   *
   * @param duckId string
   */
  const duckShot = (duckId: string) => {
    const duck = (duckId === 'duck1') ? duck1 : duck2;

    // If there bullets and duck is not flying away
    if (bullets > 0 && duck.duckOrientationNum !== 2) {
      duck.shot = true;
      // duck shot
      duck.e.style.backgroundPosition = '-435px -145px';
      setTimeout(() => {
        duck.e.style.backgroundPosition = '-435px -290px';
        duckShotFrame(duckId, false);
      }, 400);
    }
  };

  /**
   * Based on out come, choose the  appropriate dog sprite for the animation
   */
  const dogStart = () => {
    // Verify both ducks have either been shot or flown away
    if (duck1.finished && duck2.finished) {
      // Add dog to overlay
      dog.style.top = `${overlay.offsetHeight + duckHeight}px`;
      dog.className = 'duckhunt-sprites duckhunt-dog';

      if (duck1.shot && duck2.shot) {
        // If both ducks had been shot
        dog.style.backgroundPosition = '0px -435px';
        dog.style.width = '250px';
      } else if (duck1.shot || duck2.shot) {
        // If one duck was shot
        dog.style.backgroundPosition = '-250px -435px';
        dog.style.width = '200px';
      } else {
        // If the dog needs to mock some one
        dog.style.backgroundPosition = '-450px -435px';
        dog.style.width = '150px';
      }
      dog.style.top = `${overlay.offsetHeight}px`;

      // Begin animation
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      dogFrame(true);
    }
  };

  /**
   * Dog laughing animation
   *
   * @param framesLeft number frames left to be mocked
   */
  const dogLaughing = (framesLeft: number) => {
    if (framesLeft > 0) {
      dog.style.backgroundPosition = (dog.style.backgroundPosition === '-450px -435px') ? '-600px -435px' : '-450px -435px';
      setTimeout(() => { dogLaughing(framesLeft - 1); }, 110);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      dogFrame(false);
    }
  };

  /**
   * Dog animation
   *
   * @param goingUp boolean
   */
  const dogFrame = (goingUp: boolean) => {
    const dogPixelsDisplayed = overlay.offsetHeight - Number.parseInt(dog.style.top, 10);

    if (dogPixelsDisplayed < 160 && goingUp) {
      // if the height of the dog displayed is less n the total
      // height of the dog and the dog is going up, then subtract
      // from the top offset lather, rinse, repeat
      dog.style.top = `${Number.parseInt(dog.style.top, 10) - 20}px`;
      setTimeout(() => { dogFrame(goingUp); }, 60);
    } else if (dogPixelsDisplayed > 0 && !goingUp) {
      // if the dog is going down and some is still being displayed
      // add to the top offset lather, rinse, repeat
      dog.style.top = `${Number.parseInt(dog.style.top, 10) + 20}px`;
      setTimeout(() => { dogFrame(goingUp); }, 60);
    } else if (dogPixelsDisplayed >= 160 && dog.style.backgroundPosition === '-450px -435px') {
      // if the entire dog is being displayed, laugh before reversing
      dogLaughing(8);
    } else if (dogPixelsDisplayed >= 160) {
      // if the entire dog is being displayed, pause before reversing
      setTimeout(() => { dogFrame(!goingUp); }, 1000);
    } else {
      // when complete, remove the evidence before the cops get here
      document.body.removeChild(overlayOuter);
      if (callback) {
        callback();
      }
    }
  };

  /**
   * Deducts bullets and does flash over effect.
   */
  const shotFlash = () => {
    // Ensure there are bullets
    if (bullets > 0) {
      const duck1Classes = duck1.e.className;
      const duck2Classes = duck2.e.className;

      // deduct bullets
      bullets -= 1;

      overlayOuter.style.backgroundColor = 'rgb(0, 0, 0)';
      overlay.style.backgroundColor = 'rgb(0, 0, 0)';
      duck1.e.style.backgroundColor = 'rgb(255, 255, 255)';
      duck2.e.style.backgroundColor = 'rgb(255, 255, 255)';
      duck1.e.style.backgroundImage = 'none';
      duck2.e.style.backgroundImage = 'none';
      setTimeout(() => {
        overlayOuter.style.backgroundColor = '';
        overlay.style.backgroundColor = '';
        duck1.e.style.backgroundColor = '';
        duck2.e.style.backgroundColor = '';
        duck1.e.style.backgroundImage = '';
        duck2.e.style.backgroundImage = '';
        duck1.e.className = duck1Classes;
        duck2.e.className = duck2Classes;
      }, 100);
    }
  };

  overlay.className = 'duckhunt-overlay';
  overlay.addEventListener('click', shotFlash);

  // ids
  duck1.e.id = 'duck1';
  duck2.e.id = 'duck2';

  // classes
  duck1.e.className = 'duckhunt-sprites duckhunt-duck';
  duck2.e.className = 'duckhunt-sprites duckhunt-duck duckhunt-hoz-flip';

  // bind duckShot() to onclick event
  duck1.e.addEventListener('click', () => duckShot('duck1'));
  duck2.e.addEventListener('click', () => duckShot('duck2'));

  // start animation
  duckFlapFrame('duck1', 1);
  duckFlapFrame('duck2', 1);
};

export default duckhunt;
