import SortComponent from "../components/sorting.js";
import TasksComponent from "../components/task-list.js";
import LoadMoreComponent from "../components/load-more-button.js";
import CardComponent from "../components/task-card.js";
import FormComponent from "../components/task-form.js";
import {render, remove, RenderPosition} from "../utils/render.js";

export default class BoardController {
  constructor(container) {
    this._container = container;

    this._SHOWING_TASKS_COUNT_ON_START = 8;
    this._SHOWING_TASKS_COUNT_BY_BUTTON = 8;

    this._sortingComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreComponent();
  }

  renderTask(taskListElement, task) {
    const taskComponent = new CardComponent(task);
    const taskEditComponent = new FormComponent(task);

    taskComponent.setClickHandler(() => {
      taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
    });

    taskEditComponent.setSubmitHandler(() => {
      taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
    });

    render(taskListElement, taskComponent, RenderPosition.BEFOREEND);
  }

  render(tasks) {
    const container = this._container.getElement();

    render(container, this._sortingComponent, RenderPosition.BEFOREEND);
    render(container, this._tasksComponent, RenderPosition.BEFOREEND);

    const taskListElement = this._tasksComponent.getElement();

    let showingTasksCount = this._SHOWING_TASKS_COUNT_ON_START;

    tasks.slice(0, showingTasksCount).forEach((task) => {
      this.renderTask(taskListElement, task);
    });

    render(container, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this._loadMoreButtonComponent.getElement().addEventListener(`click`, () => {
      const prevTasksCount = showingTasksCount;
      showingTasksCount += this._SHOWING_TASKS_COUNT_BY_BUTTON;
      tasks.slice(prevTasksCount, showingTasksCount).forEach((task) => {
        this.renderTask(taskListElement, task);
      });

      if (showingTasksCount >= tasks.length) {
        remove(this._loadMoreButtonComponent);
      }
    });
  }
}
