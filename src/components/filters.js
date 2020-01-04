import AbstractComponent from "./abstract-component";

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
    this._FILTER_ID_PREFIX = `filter__`;
  }

  getTemplate() {
    return `<section class="main__filter filter container">
        ${this._filters.map((it) => (`<input
          type="radio"
          id="filter__${it.name}"
          class="filter__input visually-hidden"
          name="filter"
          ${it.checked ? `checked` : ``}
        />
        <label for="filter__${it.name}" class="filter__label">
          ${it.name} <span class="filter__all-count">${it.count}</span></label
        >`)).join(`\n`)}
      </section>`;
  }

  _getFilterNameById(id) {
    return id.substring(this._FILTER_ID_PREFIX.length);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = this._getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }
}
