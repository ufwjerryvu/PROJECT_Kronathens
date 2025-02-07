import { Task } from './Task';

/* Group interface for organizing collections of related tasks */
export interface Group {
    id: string;
    name: string;
    tasks: Task[];
}