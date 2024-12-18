import { CardInformation } from './CardInformation'

export interface GroupInformation {
    id?: string,
    name?: string,
    description?: string,
    cards?: CardInformation[]
};