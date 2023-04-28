import { el, setChildren } from 'redom';
import Controller from '../../controller';
import WinnerItem from '../elements/WinnerItem';
import { Winner } from '../../../types';
import { store } from '../../utils';
import Page from './Page';

class Winners extends Page {
  controller: Controller;

  constructor() {
    super(
      el('.winners'),
      10,
      1,
      0,
      el('.winners__total'),
      el('button.pageBtns__nextPage.btn', 'next') as HTMLButtonElement,
      el('button.pageBtns__prevPage.btn', 'prev') as HTMLButtonElement,
      el('.winners__page-count'),
      el('.winners__page-btns'),
    );
    this.controller = new Controller();
  }

  async box(data: Winner[]) {
    const elem = await this.drawWinList(data);
    setChildren(this.container, elem);
    return this.container;
  }

  async drawWinList(data: Winner[]) {
    return Promise.all(data.map((item) => {
      const { id, wins, time } = item;
      const winner = new WinnerItem(time, wins, id, this.controller);
      return winner.draw();
    }));
  }

  async updateList() {
    const winnerList = await this.controller.getAll('winners', this.page, this.limit, store.sortBy);
    this.total = winnerList.total;
    this.totalCount.textContent = `Winners in list: ${this.total}`;
    await this.box(winnerList.items as Winner[]);
  }
}

export default Winners;
