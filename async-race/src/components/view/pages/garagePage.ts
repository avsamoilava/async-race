import { el, setChildren } from 'redom';
import Garage from './garage';
import { ResponseTotal, Car } from '../../../types';
import Controller from '../../controller';
import { store } from '../../utils';

class GaragePage extends Garage {
  createBtn: HTMLElement;

  createForm: HTMLFormElement;

  updateForm: HTMLFormElement;

  generateBtn: HTMLElement;

  constructor() {
    super();
    this.createBtn = el('button.createCar__btn.btn.btn_colored', 'create', { type: 'submit' });
    this.createForm = el('form.controls__row.createCar') as HTMLFormElement;
    this.updateForm = el('form.controls__row.updateCar') as HTMLFormElement;
    this.generateBtn = el('button.controls__generate.btn', 'generate cars');
  }

  async element(data: ResponseTotal): Promise<HTMLElement> {
    const controls = await this.renderControls();
    const box = this.box(data.items as Car[]);
    this.total = data.total;
    this.totalCount.textContent = `Cars in garage: ${this.total}`;
    const pageBtns = this.renderPageBtns(this.total);
    setChildren(this.pageBtnsWrapper, [pageBtns]);
    box.addEventListener('click', (e: Event) => {
      this.removeHandler(e);
    });
    return el('.garage', [controls, this.totalCount, this.pageCount, box, this.pageBtnsWrapper]);
  }

  async renderControls(): Promise<HTMLElement> {
    setChildren(this.createForm, [
      el('input.createCar__name', { type: 'text', name: 'name' }),
      el('input.createCar__color', { type: 'color', name: 'color' }),
      this.createBtn,
    ]);
    this.createForm.onsubmit = (e) => {
      this.changeCarList(e, 'create');
      this.createForm.reset();
    };

    setChildren(this.updateForm, [
      el('input.updateCar__name', { type: 'text', name: 'name' }),
      el('input.updateCar__color', { type: 'color', name: 'color' }),
      el('button.updateCar__btn.btn.btn_colored', 'update'),
    ]);
    this.updateForm.onsubmit = (e) => {
      this.changeCarList(e, 'update');
      this.updateForm.reset();
    };
    this.generateBtn.onclick = async () => {
      Controller.generate();
      await this.updateList();
      setChildren(this.pageBtnsWrapper, [this.renderPageBtns(this.total)]);
    };
    return el('.garage__controls.controls', [
      this.createForm,
      this.updateForm,
      el('.controls__row', [
        el('button.controls__race.btn', 'race'),
        el('button.controls__reset.btn', 'reset', { disabled: true }),
        this.generateBtn,
      ])]);
  }

  getParams(actionType: 'create' | 'update') {
    const data = new FormData(actionType === 'create' ? this.createForm : this.updateForm);
    const params = { name: data.get('name') as string, color: data.get('color') as string };
    return params;
  }

  renderPageBtns(n: number): HTMLElement {
    this.prevBtn.disabled = this.page === 1;
    this.nextBtn.disabled = this.page === Math.ceil(n / this.limit);
    this.nextBtn.onclick = () => this.changePage('next');
    this.prevBtn.onclick = () => {
      this.changePage('prev');
    };
    return el('.garage__pageBtns.pageBtns', [this.prevBtn, this.nextBtn]);
  }

  async changeCarList(e: Event, actionType: 'create' | 'update') {
    e.preventDefault();
    const { name, color } = this.getParams(actionType);
    if (actionType === 'create' && name) await this.controller.createCar(name, color);
    if (actionType === 'update' && name) {
      const selected: HTMLElement | null = document.querySelector('.car_selected');
      const id = selected ? Number(selected.dataset.id) : 0;
      await this.controller.updateCar(name, color, id);
    }
    await this.updateList();
  }

  async removeHandler(e: Event) {
    const elem = e.target as HTMLElement;
    if (elem && elem.classList.contains('car__remove')) {
      const id = Number(elem.dataset.id);
      await this.controller.deleteCar(id);
      await this.controller.deleteWinner(id);
      await this.updateList();
    }
  }

  async changePage(order: 'prev' | 'next') {
    this.page += order === 'next' ? 1 : -1;
    this.pageCount.textContent = `Page #${this.page}`;
    this.updateList();
    store.garagePage = this.page;
    const resp = await this.controller.getAll('cars', this.page, this.limit);
    const total = Number(resp.total);
    this.prevBtn.disabled = this.page === 1;
    this.nextBtn.disabled = this.page === Math.ceil(total / this.limit);
  }
}

export default GaragePage;
