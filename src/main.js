import SiteMenuComponent from './components/menu.js';
import BoardComponent from "./components/board.js";
import BoardController from "./controllers/board.js";
import TasksModel from "./models/tasks.js";
import {generateTasks} from './mock/task.js';
import {render, RenderPosition} from "./utils/render.js";
import FiltersController from "./controllers/filters.js";

const TASK_COUNT = 22;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const siteMenuComponent = new SiteMenuComponent();

siteMenuComponent.getElement().querySelector(`.control__label--new-task`)
    .addEventListener(`click`, () => {
      boardController.createTask();
    });

render(siteHeaderElement, siteMenuComponent, RenderPosition.BEFOREEND);

const tasks = generateTasks(TASK_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filtersController = new FiltersController(siteMainElement, tasksModel);
filtersController.render();

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);

const boardController = new BoardController(boardComponent, tasksModel);
boardController.render();
