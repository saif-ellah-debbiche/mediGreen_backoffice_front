import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Plant } from '../../models/Plant';
import { Observable } from 'rxjs';
import { RecognizePlantResult } from '../../models/recognize-plant-result';
import { SearchResult } from '../../models/search_result';
import { SimilarPlant } from '../../models/similar_plant';

@Injectable({
  providedIn: 'root'
})
export class PlantsService {
private baseUrl = environment.apiUrl;
private plantsEndPoint = this.baseUrl+"/plants";
  constructor(private http: HttpClient) { }



  createPlant(plant:Plant,image: File|null):Observable<Plant>{
    const formData = new FormData();
    formData.append(
      'data',
      new Blob([JSON.stringify(plant)], { type: 'application/json' })
    );
    if(image) formData.append('image', image);

    return this.http.post<Plant>(this.plantsEndPoint, formData);

  }
  updatePlant(plant:Plant,plantId:string|undefined,image: File|null):Observable<Plant>{
    const formData = new FormData();
    formData.append(
      'data',
      new Blob([JSON.stringify(plant)], { type: 'application/json' })
    );
    if(image) formData.append('image', image);

    return this.http.put<Plant>(this.plantsEndPoint+"/"+plantId, formData);

  }

  getPlants(page:number,plantsPerPage:number,lang:string|undefined):Observable<Plant[]>{
     const params = new HttpParams()
    .set('page', page)
    .set('size', plantsPerPage)
    .set('lang', lang||"en");
      return this.http.get<Plant[]>(this.plantsEndPoint,{params})
  }

  simpleSearch(query:string,limit:number){
          const params = new HttpParams()
    .set('query', query)
    .set('limit', limit);
      return this.http.get<Plant[]>(this.plantsEndPoint+"/simple-search",{params})
  }

  semanticSearch(query:string,limit:number,lang:String="en"):Observable<SearchResult[]>{
          const params = new HttpParams()
    .set('query', query)
    .set('limit', limit)
    .set('lang', lang.toLowerCase());
      return this.http.get<SearchResult[]>(this.plantsEndPoint+"/semantic-search",{params})
  }
  reembedPlant(plantId:string|undefined  ){
      return this.http.get<Plant[]>(this.plantsEndPoint+"/reembed"+"/"+plantId)
  }
 

  deletePlant(id:string){
    return this.http.delete(this.plantsEndPoint+"/"+id);
  }
  recognizePlant(image:File,lang='en'):Observable<RecognizePlantResult[]>{
    const formData = new FormData();
    formData.append("image",image)
    formData.append("lang",lang)
    return this.http.post<RecognizePlantResult[]>(this.plantsEndPoint+"/recognize-plant",formData);
  }

  getSimilarPlants(plantId:string):Observable<SimilarPlant[]>{
    return this.http.get<SimilarPlant[]>(this.plantsEndPoint+"/similarPlants/"+plantId) 

  }




}
