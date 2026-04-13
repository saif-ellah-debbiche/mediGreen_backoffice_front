import { CommonName } from "./common-name";
import { ConfusionReason } from "./confusion-reason";
import { Disease } from "./disease";
import { SimilarPlant } from "./similar_plant";

export interface Plant {
  id?: string;
  name: string;
  scientificName: string;
  commonNames: String[];
  description: string;
  translatedDescription: string;
  imageUrl?: string;
  keywords: string[];
  targetedDiseases?: Disease[],
  similarPlants: SimilarPlant[];
}