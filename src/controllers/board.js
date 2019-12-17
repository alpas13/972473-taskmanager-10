import SortComponent from "../components/sorting.js";
import TasksComponent from "../components/task-list.js";
import LoadMoreComponent from "../components/load-more-button.js";
import TaskController from "./task.js";
import {render, remove, RenderPosition} from "../utils/render.js";

export default class BoardController {
  constructor(container) {
    this._container = container;

    this._SHOWING_TASKS_COUNT_ON_START = 8;
    this._SHOWING_TASKS_COUNT_BY_BUTTON = 8;

    this._tasks = [];
    this._showedTaskControllers = [];
    this._showedTasksCount = this._SHOWING_TASKS_COUNT_ON_START;
    this._sortingComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreComponent();
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  renderTasks(taskListElement, tasks, onDataChange, onViewChange) {
    return tasks.map((task) => {
      const taskController = new TaskController(taskListElement, onDataChange, onViewChange);
      taskController.render(task);
      return taskController;
    });
  }

  render(tasks) {
    this._tasks = tasks;
    const container = this._container.getElement();

    render(container, this._sortingComponent, RenderPosition.BEFOREEND);
    render(container, this._tasksComponent, RenderPosition.BEFOREEND);

    const taskListElement = this._tasksComponent.getElement();

    const newTasks = this.renderTasks(taskListElement, this._tasks.slice(0, this._showedTasksCount), this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

    this._renderLoadMoreButton();
  }

  _renderLoadMoreButton() {
    if (this._showedTasksCount >= this._tasks.length) {
      return;
    }

    const container = this._container.getElement();
    render(container, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this._loadMoreButtonComponent.setClickHandler(() => {
      const taskListElement = this._tasksComponent.getElement();
      const prevTasksCount = this._showedTasksCount;
      this._showedTasksCount += this._SHOWING_TASKS_COUNT_BY_BUTTON;
      const newTasks = this.renderTasks(taskListElement, this._tasks.slice(prevTasksCount, this._showedTasksCount), this._onDataChange, this._onViewChange);
      this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

      if (this._showedTasksCount >= this._tasks.length) {
        remove(this._loadMoreButtonComponent);
      }
    });
  }

  _onDataChange(taskController, oldData, newData) {
    const index = this._tasks.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), newData, this._tasks.slice(index + 1));
    taskController.render(this._tasks[index]);
  }

  _onViewChange() {
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }
}
