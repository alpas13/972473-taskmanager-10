const TASK_COUNT = 3;

import {createSiteMenuTemplate} from './components/menu.js';
import {createFilterTemplate} from './components/filters.js';
import {createBoardTemplate} from './components/task-list.js';
import {createTaskTemplate} from './components/task-card.js';
import {createEditTaskTemplate} from './components/task-form';
import {createLoadMoreButtonTemplate} from './components/load-more-button';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, createSiteMenuTemplate(), `beforeend`);
render(siteMainElement, createFilterTemplate(), `beforeend`);
render(siteMainElement, createBoardTemplate(), `beforeend`);

const taskListElement = siteMainElement.querySelector(`.board__tasks`);

render(taskListElement, createEditTaskTemplate(), `beforeend`);

new Array(TASK_COUNT)
    .fill(``)
    .forEach(() => {
      render(taskListElement, createTaskTemplate(), `beforeend`);
    });

const boardElement = siteMainElement.querySelector(`.board`);

render(boardElement, createLoadMoreButtonTemplate(), `beforeend`);
