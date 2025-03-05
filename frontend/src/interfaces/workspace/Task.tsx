import { Subtask } from './Subtask';

/* Task interface for organizing collections of related tasks */
export interface Task {
    id: string;
    name: string;
    tasks: Subtask[];
}