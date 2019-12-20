import AbstractComponent from "./abstract-component";

export default class LoadMore extends AbstractComponent {
  getTemplate() {
    return `<button class="load-more" type="button">load more</button>`;
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
