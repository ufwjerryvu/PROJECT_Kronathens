import { GroupInformation } from "../../interfaces/dashboard/GroupInformation";
import { CardInformation } from "../../interfaces/dashboard/CardInformation";

/* Helper function to not clutter up the box code */
const sortCards = (cards: CardInformation[], sortBy: string): CardInformation[] => {
    return [...cards].sort((a, b) => {
        switch (sortBy) {
            case 'date-created':
                return b.dateCreated.getTime() - a.dateCreated.getTime(); 
            case 'date-modified':
                return b.dateModified.getTime() - a.dateModified.getTime();

            case 'name-asc':
                return a.title.toLowerCase().localeCompare(b.title.toLowerCase());

            case 'name-desc':
                return b.title.toLowerCase().localeCompare(a.title.toLowerCase());

            case 'priority':
                /* Higher priority would be the ones where there is a lower completion
                    rate */
                return a.completionPercentage - b.completionPercentage; 

            default:
                return 0;
        }
    });
};

export default sortCards;