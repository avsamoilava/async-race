import { el } from 'redom';
import { Car } from '../../../types';
import { drawCarIcon } from '../../utils';
import finishFlag from '../../../assets/images/finish.png';

class CarItem implements Car {
  name: string;

  color: string;

  id?: number;

  select: HTMLElement;

  remove: HTMLElement;

  engine: HTMLElement;

  stop: HTMLElement;

  constructor(name: string, color: string, id?: number) {
    this.name = name;
    this.color = color;
    this.id = id;
    this.select = el('button.car__select.btn', 'select', { 'data-id': `${this.id}` });
    this.remove = el('button.car__remove.btn', 'remove', { 'data-id': `${this.id}` });
    this.engine = el('button.car__eng.btn.btn_round', 'a', { 'data-id': `${this.id}`, id: `eng-${this.id}` });
    this.stop = el('button.car__stop.btn.btn_round', 'b', { 'data-id': `${this.id}`, id: `stop-${this.id}`, disabled: true });
  }

  drawCar(): HTMLElement {
    this.select.onclick = () => this.selectHandler();
    return el('.car', [
      el('.car__controls', [this.select, this.remove, this.engine, this.stop]),
      el(`.car__name#name-${this.id}`, this.name),
      el('.car__item', el(`.car__model#car-${this.id}`, drawCarIcon(this.color))),
      el('img.car__finish', { src: finishFlag, alt: 'finish flag icon', id: `finish${this.id}` }),
    ]);
  }

  selectHandler() {
    const btns = Array.from(document.querySelectorAll('.car__select')) as HTMLElement[];
    const nameInp = document.querySelector('.updateCar__name') as HTMLInputElement;
    const colorInp = document.querySelector('.updateCar__color') as HTMLInputElement;
    nameInp.value = this.name;
    colorInp.value = this.color;

    btns.forEach((btn) => {
      if (btn.classList.contains('car_selected') && Number(btn.dataset.id) !== this.id) btn.classList.remove('car_selected');
    });
    this.select.classList.toggle('car_selected');
  }
}

export default CarItem;
