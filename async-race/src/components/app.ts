import router from './router';
import View from './view';
import Controller from './controller';
import MoveControl from './view/elements/MoveControl';
import { getCarsOnPage, store, sortHandler } from './utils';
import { SortParam } from '../types';

class App {
  private controller: Controller;

  private view: View;

  private moves: MoveControl;

  constructor() {
    this.controller = new Controller();
    this.view = new View();
    this.moves = new MoveControl(this.controller);
  }

  async start() {
    this.garageListeners();
    this.winnersListeners();
    this.view.renderWrapper();
    router
      .on('/', async () => {
        const cars = await this.controller.getAll('cars', store.garagePage, 7);
        this.view.renderPage('/', cars);
      })
      .on('/winners', async () => {
        const sortOptions: SortParam = { sort: store.sortBy.sort, order: store.sortBy.order };
        const winners = await this.controller.getAll('winners', store.winnersPage, 10, sortOptions);
        this.view.renderPage('/winners', winners);
      })
      .resolve();
  }

  async garageListeners() {
    this.view.root.addEventListener('click', async (e: Event) => {
      const elem: HTMLButtonElement = e.target as HTMLButtonElement;
      if (elem && elem.classList.contains('car__eng')) {
        const id = Number(elem.dataset.id);
        this.moves.startDriving(id);
      }
      if (elem && elem.classList.contains('car__stop')) {
        const id = Number(elem.dataset.id);
        this.moves.stopDriving(id);
      }
      if (elem && elem.classList.contains('controls__race')) {
        const reset = document.querySelector('.controls__reset') as HTMLButtonElement;
        reset.disabled = false;
        elem.disabled = true;
        const ids = getCarsOnPage();
        const proms = ids.map((id) => this.moves.startDriving(id));
        const { id, duration } = await MoveControl.raceAll(proms, ids);
        const status = await this.controller.getWinnerStatus(id);
        const time = +Number(duration / 1000).toFixed(2);
        const winnerCar = document.querySelector(`#name-${id}`)?.textContent;
        this.view.renderModal(winnerCar || 'car', time);
        if (status !== 200) {
          this.controller.createWinner({ id, wins: 1, time });
        } else {
          const info = await this.controller.getWinner(id);
          const body = { wins: info.wins + 1, time: time < info.time ? time : info.time };
          await this.controller.updateWinner(id, body);
        }
      }
      if (elem && elem.classList.contains('controls__reset')) {
        const race = document.querySelector('.controls__race') as HTMLButtonElement;
        this.moves.resetAll();
        race.disabled = false;
        elem.disabled = true;
      }
    });
  }

  async winnersListeners() {
    this.view.root.addEventListener('click', async (e: Event) => {
      const elem = e.target as HTMLButtonElement;
      if (elem.classList.contains('table__sort-wins')) {
        sortHandler(elem, 'wins', 'time');
        this.view.winners.updateList();
      }
      if (elem.classList.contains('table__sort-time')) {
        sortHandler(elem, 'time', 'wins');
        this.view.winners.updateList();
      }
    });
  }
}

export default App;
