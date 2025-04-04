import { Task } from '../../interfaces/workspace/Task';

export interface CardInformation {
    id: number,
    title: string,
    dateCreated: Date,
    dateModified: Date,
    completionPercentage: number,
    taskCount: number
    tasks: Task[]
};