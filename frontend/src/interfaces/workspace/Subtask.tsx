/* Subtask interface defining core properties for individual subtask items */
export interface Subtask {
    id: string;
    text: string;
    completed: boolean;
    weight: number;
}