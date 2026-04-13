export interface RecognizePlantResult {
       label:string;
     score:number;
     imageUrl:string;
      scientificName:string;
      scientificNameFull:string;
      commonNames:string[],
       genusName:string;
       familyName:string;
        gbifId:string;
}