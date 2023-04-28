import { el, setChildren } from 'redom';
import { ResponseTotal, Winner } from '../../../types';
import Winners from './winners';
import { store, createSortBtn } from '../../utils';

class WinnersPage extends Winners {
  constructor() {
    super();
    this.totalCount.textContent = `Winners in list: ${this.total}`;
    this.pageCount.textContent = `Page #${this.page}`;
  }

  async element(data: ResponseTotal) {
    const box = await this.box(data.items as Winner[]);
    this.total = data.total;
    this.totalCount.textContent = `Winners in list: ${this.total}`;
    const pageBtns = this.renderPageBtns(this.total);
    setChildren(this.pageBtnsWrapper, [pageBtns]);
    return el('.winners', [this.totalCount, this.pageCount, el('.winners__table.table', [
      el('.table__header', [
        el('.table__name', 'Name'),
        el('.table__car', 'Car'),
        el('.table__wins', createSortBtn('wins', store.sortBy.order)),
        el('.table__time', createSortBtn('time', store.sortBy.order)),
      ]),
      box]), this.pageBtnsWrapper]);
  }

  renderPageBtns(n:number): HTMLElement {
    this.prevBtn.disabled = this.page === 1;
    this.nextBtn.disabled = this.page === Math.ceil(n / this.limit);
    this.nextBtn.onclick = () => this.changePage('next');
    this.prevBtn.onclick = () => this.changePage('prev');
    return el('.winners__pageBtns.pageBtns', [this.prevBtn, this.nextBtn]);
  }

  async changePage(order: 'prev' | 'next') {
    this.page += order === 'next' ? 1 : -1;
    this.pageCount.textContent = `Page #${this.page}`;
    this.updateList();
    store.winnersPage = this.page;
    const resp = await this.controller.getAll('winners', this.page, this.limit);
    const total = Number(resp.total);
    this.prevBtn.disabled = this.page === 1;
    this.nextBtn.disabled = this.page === Math.ceil(total / this.limit);
  }
}

export default WinnersPage;
