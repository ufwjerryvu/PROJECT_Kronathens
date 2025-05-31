import { CardInformation } from './CardInformation'

export interface GroupInformation {
    id?: number,
    name?: string,
    description?: string,
    cards?: CardInformation[]
};