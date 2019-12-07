import {createElement} from "../utils";

export default class Filter {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return `<section class="main__filter filter container">
        ${this._filters.map((it, i) => (`<input
          type="radio"
          id="filter__${it.name}"
          class="filter__input visually-hidden"
          name="filter"
          ${i === 0 ? `checked` : ``}
        />
        <label for="filter__all" class="filter__label">
          ${it.name} <span class="filter__all-count">${it.count}</span></label
        >`)).join(`\n`)}
      </section>`;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._elemetn = null;
  }
}
