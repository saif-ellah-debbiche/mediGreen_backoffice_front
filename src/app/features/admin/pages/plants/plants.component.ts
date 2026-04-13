import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, signal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Plant } from '../../../../core/models/Plant';
import { PlantsService } from '../../../../core/services/plants/plants.service';
import { firstValueFrom } from 'rxjs';
import { PlantFormComponent } from "../../components/plant-form/plant-form.component";
import { LanguageService } from '../../../../core/services/language-service/language.service';
import { LoadingService } from '../../../../core/services/loading/loading.service';
import { ToastService } from '../../../../core/services/toast/toast.service';




@Component({
  selector: 'app-plants',
  templateUrl: './plants.component.html',
  imports: [FormsModule, CommonModule, PlantFormComponent], 
  styleUrls: ['./plants.component.scss'],
})
export class PlantsComponent implements OnInit {
  language:Signal<String>|null=null;
  
  searchQuery = '';
  showModal = false;
  selectedPlant: Plant | null = null;
  currentPage=0;
  plantsPerPage=6;
  plants = signal<Plant[]>([]);
  displayedPlants:Plant[]=[];

  lastPage=-1;


  plantsService=inject(PlantsService);
  languageService=inject(LanguageService);
  loadingService=inject(LoadingService);
  toastService=inject(ToastService);

  constructor() {
       effect(() => {
    const lang = this.languageService.currentLang();
    this.loadPlants(lang);
  });
  }

  ngOnInit(): void {
      this.language =this. languageService.currentLang;
      console.log(this.language)
 
  }

  blockNext(){
    return this.lastPage!=-1&& this.currentPage>= this.lastPage;
  }

  loadPlants(lang: 'en' | 'fr' | 'ar') {
 this.plantsService.getPlants(this.currentPage,this.plantsPerPage,lang).subscribe({
      next:plants=>{
        this.plants.set(plants);
        if(plants.length<this.plantsPerPage){
          this.lastPage=this.currentPage;
        }
        this.displayedPlants=plants.slice(this.currentPage,this.plantsPerPage);
        console.log(plants)
      },
      error:err=>{
          this.toastService.show(this.language?.()=="en" ? "something wen wrong when loading plants,retry later":"حدث خطأ أثناء تحميل النباتات، حاول مرة أخرى لاحقًا","error")
      }
     })
  }
  async nextPage(){
    this.currentPage+=1;


    if(this.plants().length > this.currentPage  * this.plantsPerPage ){
      console.log("plants are ",this.plants)
      this.displayedPlants = this.plants().slice(this.currentPage*this.plantsPerPage,this.currentPage*this.plantsPerPage+this.plantsPerPage);
      console.log("displayed are from "+this.currentPage*this.plantsPerPage +" to "+this.currentPage*this.plantsPerPage+this.plantsPerPage,this.plants)
    }
    else{ 
      const otherPlants =await firstValueFrom(this.plantsService.getPlants(this.currentPage, this.plantsPerPage,this.language?.().toString()));
      if(otherPlants.length<this.plantsPerPage){
          this.lastPage=this.currentPage;
        }
      this.plants().push(...otherPlants);
      this.displayedPlants=this.plants().slice(this.currentPage*this.plantsPerPage,this.currentPage*this.plantsPerPage+this.plantsPerPage);
    }
  }
  previousPage(){
    if(this.currentPage<=0) return;
    this.currentPage-=1;
    this.displayedPlants=this.plants().slice(this.currentPage*this.plantsPerPage,this.currentPage*this.plantsPerPage+this.plantsPerPage);
  }

  getMorePlants(){
      this.plantsService.getPlants(this.currentPage,this.plantsPerPage,this.language?.().toString()).subscribe({
      next:plants=>{
        this.plants().push(...plants);
      },
      error:err=>{
      }
     })
  }

  async filterPlants(query:string){
    if (!query){
      this.displayedPlants= this.plants().slice(this.currentPage*this.plantsPerPage,this.currentPage*this.plantsPerPage+this.plantsPerPage);
      return;
    } 
    this.displayedPlants=[];
    this.displayedPlants=await firstValueFrom(
    this.plantsService.simpleSearch(query, this.plantsPerPage));
    
  }

  get noResults(): boolean {
  return this.displayedPlants.length==0&&this.searchQuery.length!=0;
}
  async semanticAiSearch(){
    if (!this.searchQuery.length){
      this.displayedPlants= this.plants().slice(this.currentPage,this.plantsPerPage);
      return;
    } 
    this.displayedPlants=[];
    this.loadingService.show(this.language?.()=="en" ? "searching ...":"جاري البحث...")
    const results=await firstValueFrom(
    this.plantsService.semanticSearch(this.searchQuery, this.plantsPerPage,this.language?.()))
    ;
    this.loadingService.hide();
    console.log("results are : ",results)
    this.displayedPlants =results.sort((r1,r2)=>r2.score - r1.score).map(r=>r.plant);
    console.log(this.displayedPlants)
  }




  openModal(plant?: Plant): void {
    this.selectedPlant = plant || null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedPlant = null;
    console.log("closing module");
  }

  savePlant(plant:Plant){
    this.plants().push(plant);
    this.updateDisplay();
  }
  updateDisplay(){
    this.displayedPlants= this.plants().slice(this.currentPage *this.plantsPerPage,this.currentPage *this.plantsPerPage + this.plantsPerPage )
  }

  reembed(plantId:string|undefined){
    this.plantsService.reembedPlant(plantId).subscribe({
      next:response=>{

      },error:err=>{
        console.log(err)
      }
    })

  }
  


 

  addPlant(): void {
    this.openModal();
  }

  editPlant(plant: Plant): void {
    console.log("selected plant : "+plant)
    this.openModal(plant);
  }

  deletePlant(id: string|undefined): void {
    if(!id) return;
    if (confirm(this.language?.() === 'en' ? 'Delete this plant?' : 'حذف هذا النبات؟')) {
      this.loadingService.show(this.language?.()=="en"?"deleting plant":"جاري حذف النبات...")
      this.plantsService.deletePlant(id).subscribe({
        next:response=>{
          console.log("plant deleted");
          this.loadingService.hide();
          this.toastService.show(this.language?.() === 'en' ? 'Plant was deleted succussfully':'تم حذف النبات بنجاح')
            const indexInPlants = this.plants().findIndex(p => p.id === id);

  if (indexInPlants !== -1) {
    this.plants().splice(indexInPlants, 1); // ✅ modifies same array
  }
            const indexInDisplayedPalnts = this.displayedPlants.findIndex(p => p.id === id);
            if (indexInDisplayedPalnts !== -1) {
    this.displayedPlants.splice(indexInDisplayedPalnts, 1); // ✅ modifies same array
  }
        }
      ,
    error:err=>{
       this.loadingService.hide();
          this.toastService.show(this.language?.() === 'en' ? 'Something went wrong when deleting plant,retry next time':'حدث خطأ أثناء حذف النبات، حاول مرة أخرى لاحقًا',"error")

      console.log(err)
    }},
  )
    }
  }


  getLabel(label: string, labelAr: string): string {
    return this.language?.() === 'en' ? label : labelAr;
  }
}
