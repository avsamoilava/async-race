export interface Car {
  name: string;
  color: string;
  id?: number;
}

export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export interface ResponseTotal {
  items: Car[] | Winner[];
  total: number;
}

export interface Engine {
  velocity: number;
  distance: number;
}

export type AnimState = {
  carId: number;
  animId: number;
};

export type Success = {
  success: boolean;
  id: number;
  duration: number;
};

export type SortParam = {
  sort: 'id' | 'wins' | 'time',
  order: 'ASC' | 'DESC',
};

export type Store = {
  garagePage: number,
  winnersPage: number,
  sortBy: SortParam
};
