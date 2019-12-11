import AbstractComponent from "./abstract-component";

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
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
}
