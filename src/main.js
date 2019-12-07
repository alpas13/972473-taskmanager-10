import SiteMenuComponent from './components/menu.js';
import FilterComponent from './components/filters.js';
import BoardComponent from './components/task-list.js';
import CardComponent from './components/task-card.js';
import FormComponent from './components/task-form.js';
import LoadMoreButtonComponent from './components/load-more-button.js';
import {generateFilters} from './mock/filter.js';
import {generateTasks} from './mock/task.js';
import {render, RenderPosition} from "./utils.js";

const TASK_COUNT = 22;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTask = (task) => {
  const taskComponent = new CardComponent(task);
  const taskEditComponent = new FormComponent(task);

  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);
  editButton.addEventListener(`click`, () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  });

  const editForm = taskEditComponent.getElement().querySelector(`.card__form`);
  editForm.addEventListener(`submit`, () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  });

  render(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREEND);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, new SiteMenuComponent().getElement(), RenderPosition.BEFOREEND);

const filters = generateFilters();
render(siteMainElement, new FilterComponent(filters).getElement(), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent.getElement(), RenderPosition.BEFOREEND);

const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);
const tasks = generateTasks(TASK_COUNT);

let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

tasks.slice(0, showingTasksCount).forEach((task) => {
  renderTask(task);
});

const loadMoreButtonComponent = new LoadMoreButtonComponent();
render(boardComponent.getElement(), loadMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

loadMoreButtonComponent.getElement().addEventListener(`click`, () => {
  const prevTasksCount = showingTasksCount;
  showingTasksCount += SHOWING_TASKS_COUNT_BY_BUTTON;
  tasks.slice(prevTasksCount, showingTasksCount).forEach((task) => {
    renderTask(task);
  });

  if (showingTasksCount >= tasks.length) {
    loadMoreButtonComponent.getElement().remove();
    loadMoreButtonComponent.removeElement();
  }
});
