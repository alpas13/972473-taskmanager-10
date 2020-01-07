import AbstractComponent from "./abstract-component.js";

export default class SortComponent extends AbstractComponent {
  constructor() {
    super();
    this.SortType = {
      DATE_DOWN: `date-down`,
      DATE_UP: `date-up`,
      DEFAULT: `default`,
    };
    this._currentSortType = this.SortType.DEFAULT;
  }

  getTemplate() {
    return (`<div class="board__filter-list">
              <a href="#" data-sort-type="${this.SortType.DEFAULT}" class="board__filter">SORT BY DEFAULT</a>
              <a href="#" data-sort-type="${this.SortType.DATE_UP}" class="board__filter">SORT BY DATE up</a>
              <a href="#" data-sort-type="${this.SortType.DATE_DOWN}" class="board__filter">SORT BY DATE down</a>
            </div>`);
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (sortType === this._currentSortType) {
        return;
      }

      this._currentSortType = sortType;

      handler(this._currentSortType);
    });
  }
}
