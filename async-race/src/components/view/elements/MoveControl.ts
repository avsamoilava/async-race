import { Success } from '../../../types';
import Controller from '../../controller';
import { getDistance, getCarsOnPage } from '../../utils';

const animId = new Map();

class MoveControl {
  c: Controller;

  constructor(c: Controller) {
    this.c = c;
  }

  async startDriving(id: number) {
    const start = document.querySelector(`button#eng-${id}`) as HTMLButtonElement;
    const stop = document.querySelector(`button#stop-${id}`) as HTMLButtonElement;
    start.disabled = true;
    const { velocity, distance } = await this.c.engineStart(id);
    stop.disabled = false;
    const duration = Math.floor(distance / velocity);
    const car = document.querySelector(`#car-${id}`) as HTMLElement;
    const flag = document.querySelector(`#finish${id}`) as HTMLElement;
    const htmlDistance = getDistance(car, flag);
    MoveControl.animation(id, htmlDistance, duration);
    const { success } = await this.c.goDrive(id);
    if (!success) {
      window.cancelAnimationFrame(animId.get(id) as number);
    }
    return { success, id, duration };
  }

  async stopDriving(id: number) {
    const car = document.querySelector(`#car-${id}`) as HTMLElement;
    const start = document.querySelector(`button#eng-${id}`) as HTMLButtonElement;
    const stop = document.querySelector(`button#stop-${id}`) as HTMLButtonElement;
    stop.disabled = true;
    car.style.transform = 'translateX(0)';
    if (animId.get(id)) window.cancelAnimationFrame(animId.get(id) as number);
    await this.c.engineStop(id);
    start.disabled = false;
  }

  static animation(carId: number, distance: number, animationTime: number) {
    let start: number | null = null;
    const car: HTMLElement = document.querySelector(`#car-${carId}`) as HTMLElement;
    function step(timestamp: number) {
      if (!start) start = timestamp;
      const time = timestamp - start;
      const passed = Math.round(time * (distance / animationTime));
      car.style.transform = `translateX(${Math.min(passed, distance)}px)`;
      if (passed < distance) {
        animId.set(carId, window.requestAnimationFrame(step));
      }
    }
    animId.set(carId, window.requestAnimationFrame(step));
  }

  static async raceAll(promises: Promise<Success>[], cars: number[]): Promise<Success> {
    const { success, id, duration } = await Promise.race(promises);
    if (!success) {
      const fail = cars.findIndex((i) => i === id);
      promises.splice(fail, 1);
      cars.splice(fail, 1);
      return MoveControl.raceAll(promises, cars);
    }
    return { success, id, duration };
  }

  async resetAll() {
    const carsId = getCarsOnPage();
    await Promise.all(carsId.map((e) => this.stopDriving(e)));
  }
}

export default MoveControl;
