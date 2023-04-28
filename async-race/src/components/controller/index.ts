import { getRandomColor, getRandomName } from '../utils';
import CarItem from '../view/elements/CarItem';
import {
  Car, Engine, ResponseTotal, Winner, SortParam,
} from '../../types';

class Controller {
  private baseUrl: string;

  private garage: string;

  private winners: string;

  private engineUrl: string;

  constructor() {
    this.baseUrl = 'http://127.0.0.1:3000';
    this.garage = `${this.baseUrl}/garage`;
    this.engineUrl = `${this.baseUrl}/engine`;
    this.winners = `${this.baseUrl}/winners`;
  }

  static errorHandler(res: Response): Response {
    if (!res.ok) {
      console.log(res.statusText);
    }
    return res;
  }

  async getAll(type: 'cars' | 'winners', page: number, limit: number, sortOptions?: SortParam): Promise<ResponseTotal> {
    let url = '';
    if (type === 'cars') url = `${this.garage}?_page=${page}&_limit=${limit}`;
    else if (type === 'winners' && sortOptions) url = `${this.winners}?_page=${page}&_limit=${limit}&_sort=${sortOptions.sort}&_order=${sortOptions.order}`;
    else url = `${this.winners}?_page=${page}&_limit=${limit}`;
    const response = await fetch(url).then((res) => Controller.errorHandler(res));
    const items: Car[] | Winner[] = await response.json().catch((err) => new Error(err));
    return {
      items,
      total: Number(response.headers.get('X-Total-Count')),
    };
  }

  async getCar(id: number): Promise<Car> {
    return (await fetch(`${this.garage}/${id}`)
      .then((res) => Controller.errorHandler(res))).json();
  }

  async createCar(name: string, color: string) {
    (await fetch(this.garage, {
      method: 'POST',
      body: JSON.stringify({ name, color }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => Controller.errorHandler(res))).json();
  }

  async updateCar(name: string, color: string, id: number) {
    (await fetch(`${this.garage}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, color }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => Controller.errorHandler(res))).json();
  }

  async deleteCar(id: number) {
    (await fetch(`${this.garage}/${id}`, {
      method: 'DELETE',
    }).then((res) => Controller.errorHandler(res))).json();
  }

  static async generate() {
    const randomCars: CarItem[] = Array(100)
      .fill({ name: '', color: '' })
      .map(() => new CarItem(getRandomName(), getRandomColor()));
    await Promise.allSettled(randomCars.map(({ name, color }) => fetch('http://127.0.0.1:3000/garage', {
      method: 'POST',
      body: JSON.stringify({ name, color }),
      headers: {
        'Content-Type': 'application/json',
      },
    })));
  }

  async engineStart(id: number): Promise<Engine> {
    return (await fetch(`${this.engineUrl}?id=${id}&status=started`, {
      method: 'PATCH',
    }).then((res) => Controller.errorHandler(res))).json();
  }

  async engineStop(id: number): Promise<Engine> {
    return (await fetch(`${this.engineUrl}?id=${id}&status=stopped`, {
      method: 'PATCH',
    }).then((res) => Controller.errorHandler(res))).json();
  }

  async goDrive(id: number): Promise<{ success: boolean }> {
    const response = await fetch(`${this.engineUrl}?id=${id}&status=drive`, {
      method: 'PATCH',
    }).then((res) => Controller.errorHandler(res)).catch();
    return response.status !== 200 ? { success: false } : { ...(await response.json()) };
  }

  async getWinner(id: number): Promise<Winner> {
    return (await fetch(`${this.winners}/${id}`)
      .then((res) => Controller.errorHandler(res))).json();
  }

  async createWinner(params: Winner) {
    (await fetch(this.winners, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => Controller.errorHandler(res))).json();
  }

  async deleteWinner(id: number) {
    (await fetch(`${this.winners}/${id}`, {
      method: 'DELETE',
    }).then((res) => Controller.errorHandler(res))).json();
  }

  async updateWinner(id: number, params: { wins: number, time: number }) {
    (await fetch(`${this.winners}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => Controller.errorHandler(res))).json();
  }

  async getWinnerStatus(id: number) {
    return (await fetch(`${this.winners}/${id}`)
      .then((res) => Controller.errorHandler(res))).status;
  }
}
export default Controller;
