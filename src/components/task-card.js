import {formatTime, formatDate, isOverdueDate} from '../utils/common.js';
import AbstractComponent from "./abstract-component";
import he from 'he';

export default class Card extends AbstractComponent {
  constructor(task) {
    super();
    this._task = task;
  }

  getTemplate() {
    const {description: notSanitizedDescription, tags, dueDate, color, repeatingDays, isFavorite, isArchive} = this._task;

    const description = he.encode(notSanitizedDescription);
    const isExpired = dueDate instanceof Date && isOverdueDate(dueDate, new Date());
    const isDateShowing = !!dueDate;

    const date = isDateShowing ? `${formatDate(dueDate)}` : ``;
    const time = isDateShowing ? formatTime(dueDate) : ``;

    const hashtags = Array.from(tags);
    const repeatClass = Object.values(repeatingDays).some(Boolean) ? `card--repeat` : ``;
    const deadlineClass = isExpired ? `card--deadline` : ``;
    const editButton = this._createButtonMarkup(`edit`, true);
    const archiveButton = this._createButtonMarkup(`archive`, isArchive);
    const favoritesButton = this._createButtonMarkup(`favorites`, isFavorite);

    return (`<article class="card card--${color} ${repeatClass} ${deadlineClass}">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            ${editButton}
            ${archiveButton}
            ${favoritesButton}
          </div>
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>
          <div class="card__textarea-wrap">
            <p class="card__text">${description}</p>
          </div>
          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <div class="card__date-deadline">
                  <p class="card__input-deadline-wrap">
                    <span class="card__date">${date}</span>
                    <span class="card__time">${time}</span>
                  </p>
                </div>
              </div>
              <div class="card__hashtag">
                <div class="card__hashtag-list">
                  ${hashtags.map((hashtag) => (`<span class="card__hashtag-inner">
            <span class="card__hashtag-name">
              #${hashtag}
            </span>
          </span>`)).join(`\n`)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>`);
  }

  _createButtonMarkup(name, isActive) {
    return (`<button type="button" class="card__btn card__btn--${name} 
${!isActive ? `card__btn--disabled` : ``}">${name}</button>`);
  }

  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, handler);
  }

  setArchiveButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--archive`).addEventListener(`click`, handler);
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--favorites`).addEventListener(`click`, handler);
  }
}
