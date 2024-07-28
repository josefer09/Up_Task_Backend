import { Request, Response } from "express";
import { CustomError } from "../../utils";
import { TaskService } from "../service/Task";
import { CreateTaskDto } from "../../domain/dtos/task/createTask.dto";
import { ITask } from "../../model/Task";



export class TaskController {

    // DI
    constructor(private readonly service: TaskService) {}

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ msg: error.message });
          }
      
          console.log(error);
          return res.status(500).json({ msg: "Internal Server Error " });
    }

    post = ( req: Request, res: Response ) => {
        const project = req.project;

        if (!project) {
            return this.handleError(CustomError.notFound('Project not found'), res);
        }

        const [error, createTaskDto] = CreateTaskDto.create(req.body);
        if( error ) return res.status(400).json({ error });

        this.service.createTask(createTaskDto!, project)
        .then( response => res.json(response))
        .catch( error => this.handleError(error, res));
    }

    get = (req: Request, res: Response) => {
        const project = req.project;
        
        this.service.getAllTask(project)
        .then( tasks => res.json(tasks))
        .catch( error => this.handleError(error, res));
    }

    getById = (req: Request, res: Response) => {

        const project = req.project;
        const { taskId } = req.params;

        this.service.getTaskById(project, taskId)
        .then( task => res.json(task))
        .catch( error => this.handleError(error, res));
    }

    put = (req: Request, res: Response) => {
        const project = req.project;
        const { taskId } = req.params;
        const taskData: ITask = req.body;

        this.service.updateTask(project, taskId, req.body)
        .then( taskUpdated => res.json(taskUpdated))
        .catch( error => this.handleError(error, res));
    }

    delete = (req: Request, res: Response) => {
        const project = req.project;
        const { taskId } = req.params;

        this.service.deleteTask(project, taskId)
        .then( taskDeleted => res.json(taskDeleted))
        .catch( error => this.handleError(error, res));
    }

    postStatus = (req: Request, res: Response) => {
        const project = req.project;
        const { taskId } = req.params;
        const { status } = req.body;

        this.service.updateStatus(project, taskId, status)
        .then( taskStatus => res.json(taskStatus))
        .catch( error => this.handleError(error, res));
    }
    
}