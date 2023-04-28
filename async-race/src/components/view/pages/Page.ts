abstract class Page {
  container: HTMLElement;

  limit: number;

  page: number;

  total: number;

  totalCount: HTMLElement;

  nextBtn: HTMLButtonElement;

  prevBtn: HTMLButtonElement;

  pageCount: HTMLElement;

  pageBtnsWrapper: HTMLElement;

  constructor(
    container: HTMLElement,
    limit: number,
    page: number,
    total: number,
    totalCount: HTMLElement,
    nextBtn: HTMLButtonElement,
    prevBtn: HTMLButtonElement,
    pageCount: HTMLElement,
    pageBtnsWrapper: HTMLElement,
  ) {
    this.container = container;
    this.limit = limit;
    this.page = page;
    this.total = total;
    this.totalCount = totalCount;
    this.nextBtn = nextBtn;
    this.prevBtn = prevBtn;
    this.pageCount = pageCount;
    this.pageBtnsWrapper = pageBtnsWrapper;
  }
}

export default Page;
