import {createSiteMenuTemplate} from './components/menu.js';
import {createFilterTemplate} from './components/filters.js';
import {createBoardTemplate} from './components/task-list.js';
import {createTaskTemplate} from './components/task-card.js';
import {createEditTaskTemplate} from './components/task-form';
import {createLoadMoreButtonTemplate} from './components/load-more-button';
import {generateFilters} from "./mock/filter";
import {generateTask, generateTasks} from "./mock/task";

const TASK_COUNT = 22;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, createSiteMenuTemplate(), `beforeend`);

const filters = generateFilters();
render(siteMainElement, createFilterTemplate(filters), `beforeend`);
render(siteMainElement, createBoardTemplate(), `beforeend`);

const taskListElement = siteMainElement.querySelector(`.board__tasks`);
const tasks = generateTasks(TASK_COUNT);
const newTask = generateTask();
render(taskListElement, createEditTaskTemplate(newTask), `beforeend`);

let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

tasks.slice(1, showingTasksCount).forEach((task) => {
  render(taskListElement, createTaskTemplate(task), `beforeend`);
});

const boardElement = siteMainElement.querySelector(`.board`);

render(boardElement, createLoadMoreButtonTemplate(), `beforeend`);

const loadMoreButton = boardElement.querySelector(`.load-more`);

loadMoreButton.addEventListener(`click`, () => {
  const prevTasksCount = showingTasksCount;
  showingTasksCount += SHOWING_TASKS_COUNT_BY_BUTTON;
  tasks.slice(prevTasksCount, showingTasksCount).forEach((task) => {
    render(taskListElement, createTaskTemplate(task), `beforeend`);
  });

  if (showingTasksCount >= tasks.length) {
    loadMoreButton.remove();
  }
});
