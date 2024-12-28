/* Task interface defining core properties for individual task items */
export interface Task {
    id: string;
    text: string;
    completed: boolean;
    weight: number;
}