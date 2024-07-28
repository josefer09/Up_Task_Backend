import { response, Router } from "express";
import { ProjectController } from "../controller/Project";
import { ProjectService } from "../service/Project";
import { param } from "express-validator";
import { handleInputError } from "../middleware/validation";
import { TaskController } from "../controller";
import { TaskService } from "../service/Task";
import { validateProjectExist } from "../middleware/Project";

export class ProjectRoutes {
  static get routes(): Router {
    const router = Router();

    const service = new ProjectService();

    const controller = new ProjectController(service);

    const taskService = new TaskService();
    const taskController = new TaskController(taskService);

    router.post("/", controller.post);
    router.get("/", controller.get);

    router.get(
      "/:id",
      param("id").isMongoId().withMessage("id is not mongoId"),
      handleInputError,
      controller.getById
    );
    router.put(
      "/:id",
      param("id").isMongoId().withMessage("id is not MongoId"),
      handleInputError,
      controller.put
    );
    router.delete(
      "/:id",
      param("id").isMongoId().withMessage("id is not MongoId"),
      handleInputError,
      controller.delete
    );

    // Task
    // router.param("projectId", validateProjectExist); // Mientras el parametro exista, se ejecuta el callback o middleware

    router.post(
      "/:projectId/task",
      param("projectId").isMongoId().withMessage("id is not MongoId"),
      handleInputError,
      validateProjectExist,
      taskController.post
    );
    router.get(
      "/:projectId/task",
      param("projectId").isMongoId().withMessage("id is not MongoId"),
      handleInputError,
      validateProjectExist,
      taskController.get
    );
    router.get(
      "/:projectId/task/:taskId",
      param("projectId").isMongoId().withMessage("id is not MongoId"),
      param("taskId").isMongoId().withMessage("id is not MongoId"),
      handleInputError,
      validateProjectExist,
      taskController.getById
    );

    router.put(
      "/:projectId/task/:taskId",
      param("projectId").isMongoId().withMessage("id is not MongoId"),
      param("taskId").isMongoId().withMessage("id is not MongoId"),
      handleInputError,
      validateProjectExist,
      taskController.put,
    );

    router.delete(
      "/:projectId/task/:taskId",
      param("projectId").isMongoId().withMessage("id is not MongoId"),
      param("taskId").isMongoId().withMessage("id is not MongoId"),
      handleInputError,
      validateProjectExist,
      taskController.delete,
    );

    router.post(
      "/:projectId/task/:taskId",
      param("projectId").isMongoId().withMessage("id is not MongoId"),
      param("taskId").isMongoId().withMessage("id is not MongoId"),
      handleInputError,
      validateProjectExist,
      taskController.postStatus,
    )

    return router;
  }
}
