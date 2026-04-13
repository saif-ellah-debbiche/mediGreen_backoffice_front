import { ConfusionReason } from "./confusion-reason";

export interface SimilarPlant {
    confusableWithId:number;
     name:string;
     scientificName: string; 
     reason: ConfusionReason;
     imageUrl:string 
    }