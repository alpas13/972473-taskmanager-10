import SortComponent from "../components/sorting.js";
import TasksComponent from "../components/task-list.js";
import LoadMoreComponent from "../components/load-more-button.js";
import TaskController, {Mode as TaskControllerMode, EmptyTask} from "./task.js";
import NoTasksComponent from "../components/no-tasks.js";
import {render, remove, RenderPosition} from "../utils/render.js";

export default class BoardController {
  constructor(container, tasksModel) {
    this._container = container;

    this._SHOWING_TASKS_COUNT_ON_START = 8;
    this._SHOWING_TASKS_COUNT_BY_BUTTON = 8;

    this._tasksModel = tasksModel;
    this._showedTaskControllers = [];
    this._showedTasksCount = this._SHOWING_TASKS_COUNT_ON_START;
    this._noTasksComponent = new NoTasksComponent();
    this._sortingComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreComponent();

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);

    this._tasksModel.setFilterChangeHandler(this._onFilterChange);
    this._sortingComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._creatingTask = null;
  }

  renderTasks(taskListElement, tasks, onDataChange, onViewChange) {
    return tasks.map((task) => {
      const taskController = new TaskController(taskListElement, onDataChange, onViewChange);
      taskController.render(task, TaskControllerMode.DEFAULT);
      return taskController;
    });
  }

  render() {
    const container = this._container.getElement();
    const tasks = this._tasksModel.getTasks();

    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    render(container, this._sortingComponent, RenderPosition.BEFOREEND);

    if (isAllTasksArchived) {
      render(container, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._tasksComponent, RenderPosition.BEFOREEND);

    this._renderTasks(tasks.slice(0, this._showedTasksCount));

    this._renderLoadMoreButton();
  }

  createTask() {
    if (this._creatingTask) {
      return;
    }

    const taskListElement = this._tasksComponent.getElement();

    this._creatingTask = new TaskController(taskListElement, this._onDataChange, this._onViewChange);
    this._creatingTask.render(EmptyTask, TaskControllerMode.ADDING);
  }

  _renderTasks(tasks) {
    const taskListElement = this._tasksComponent.getElement();

    const newTasks = this.renderTasks(taskListElement, tasks, this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
    this._showedTasksCount = this._showedTaskControllers.length;
  }

  _removeTasks() {
    this._showedTaskControllers.forEach((taskController) => taskController.destroy());
    this._showedTaskControllers = [];
  }

  _renderLoadMoreButton() {
    remove(this._loadMoreButtonComponent);

    if (this._showedTasksCount >= this._tasksModel.getTasks().length) {
      return;
    }

    const container = this._container.getElement();
    render(container, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this._loadMoreButtonComponent.setClickHandler(this._onLoadMoreButtonClick);
  }

  _updateTasks(count) {
    this._removeTasks();
    this._renderTasks(this._tasksModel.getTasks().slice(0, count));
    this._renderLoadMoreButton();
  }

  _onDataChange(taskController, oldData, newData) {
    if (oldData === EmptyTask) {
      this._creatingTask = null;
      if (newData === null) {
        taskController.destroy();
        this._updateTasks(this._showingTasksCount);
      } else {
        this._tasksModel.addTask(newData);
        taskController.render(newData, TaskControllerMode.DEFAULT);

        const destroyedTask = this._showedTaskControllers.pop();
        destroyedTask.destroy();

        this._showedTaskControllers = [].concat(taskController, this._showedTaskControllers);
        this._showingTasksCount = this._showedTaskControllers.length;
      }
    } else if (newData === null) {
      this._tasksModel.removeTask(oldData.id);
      this._updateTasks(this._showingTasksCount);
    } else {
      const isSuccess = this._tasksModel.updateTask(oldData.id, newData);
      if (isSuccess) {
        taskController.render(newData, TaskControllerMode.DEFAULT);
      }
    }
  }

  _onViewChange() {
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }

  _onLoadMoreButtonClick() {
    const prevTasksCount = this._showedTasksCount;
    const tasks = this._tasksModel.getTasks();

    this._showedTasksCount += this._SHOWING_TASKS_COUNT_BY_BUTTON;

    this._renderTasks(tasks.slice(prevTasksCount, this._showedTasksCount));

    if (this._showedTasksCount >= tasks.length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _onFilterChange() {
    this._updateTasks(this._SHOWING_TASKS_COUNT_ON_START);
  }

  _onSortTypeChange(sortType) {
    let sortedTasks = [];
    const tasks = this._tasksModel.getTasks();

    switch (sortType) {
      case this._sortingComponent.SortType.DATE_DOWN:
        sortedTasks = tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        break;
      case this._sortingComponent.SortType.DATE_UP:
        sortedTasks = tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
        break;
      case this._sortingComponent.SortType.DEFAULT:
        sortedTasks = tasks.slice(0, this._SHOWING_TASKS_COUNT_ON_START);
        break;
    }

    this._removeTasks();

    this._renderTasks(sortedTasks);

    if (sortType === this._sortingComponent.SortType.DEFAULT) {
      this._renderLoadMoreButton();
    } else {
      remove(this._loadMoreButtonComponent);
    }
  }
}
