import { el, setChildren } from 'redom';
import { Car } from '../../../types';
import CarItem from '../elements/CarItem';
import Controller from '../../controller';
import Page from './Page';

class Garage extends Page {
  controller: Controller;

  constructor() {
    super(
      el('.carList'),
      7,
      1,
      0,
      el('.garage__total'),
      el('button.pageBtns__nextPage.btn', 'next') as HTMLButtonElement,
      el('button.pageBtns__prevPage.btn', 'prev') as HTMLButtonElement,
      el('.garage__page-count'),
      el('.garage__page-btns'),
    );
    this.controller = new Controller();
  }

  box(data: Car[]) {
    setChildren(this.container, Garage.drawCarsList(data));
    return this.container;
  }

  static drawCarsList(data: Car[]): HTMLElement[] {
    return data.map((item) => {
      const { name, color, id } = item;
      const car = new CarItem(name, color, id);
      return car.drawCar();
    });
  }

  async updateList() {
    const carsList = await this.controller.getAll('cars', this.page, this.limit);
    this.total = carsList.total;
    this.totalCount.textContent = `Cars in garage: ${this.total}`;
    this.box(carsList.items as Car[]);
  }
}

export default Garage;
