import { el, setChildren, mount } from 'redom';
import { ResponseTotal } from '../../types';

import GaragePage from './pages/garagePage';
import WinnersPage from './pages/WinnersPage';

class View {
  public root: HTMLElement;

  private main: HTMLElement;

  private garage: GaragePage;

  public winners: WinnersPage;

  constructor() {
    this.root = document.querySelector('#root') as HTMLElement;
    this.main = el('main.main');
    this.garage = new GaragePage();
    this.winners = new WinnersPage();
  }

  renderWrapper(): void {
    setChildren(this.root, [
      el(
        'div.container',
        el(
          'header.header',
          el('.header__btns', [
            el('a.header__btn.btn.btn_dark', 'garage', { href: '/', 'data-navigo': '' }),
            el('a.header__btn.btn.btn_dark', 'winners', { href: '/winners', 'data-navigo': '' }),
          ]),
        ),
        this.main,
      ),
    ]);
  }

  async renderPage(path: string, data: ResponseTotal) {
    const garageElem = await this.garage.element(data);
    const winnersElem = await this.winners.element(data);
    await this.winners.updateList();
    setChildren(this.main, [path === '/winners' ? winnersElem : garageElem]);
  }

  renderModal(carName: string, time: number) {
    mount(this.root, el('div.modal', `${carName} won the race for ${time} ms`, {
      onclick: () => {
        document.querySelector('.modal')?.parentNode?.removeChild(document.querySelector('.modal') as HTMLElement);
      },
    }));
  }
}

export default View;
