import { el } from 'redom';
import { drawCarIcon } from '../../utils';
import Controller from '../../controller';
import { Car } from '../../../types';

class WinnerItem {
  id: number;

  time: number;

  wins: number;

  c: Controller;

  constructor(time: number, wins: number, id: number, c: Controller) {
    this.time = time;
    this.wins = wins;
    this.id = id;
    this.c = c;
  }

  async draw(): Promise<HTMLElement> {
    const params = await this.getInfo(this.id);
    return el('.winner', [
      el('.winner__name', params.name),
      el('.winner__car', [drawCarIcon(params.color)]),
      el('.winner__wins', this.wins),
      el('.winner__time', this.time),
    ]);
  }

  async getInfo(id: number) {
    const { name, color }: Car = await this.c.getCar(id);
    return { name, color };
  }
}

export default WinnerItem;
