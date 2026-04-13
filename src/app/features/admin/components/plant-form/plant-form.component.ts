import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { LanguageService } from '../../../../core/services/language-service/language.service';
import { PlantsService } from '../../../../core/services/plants/plants.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { Plant } from '../../../../core/models/Plant';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfusionReason } from '../../../../core/models/confusion-reason';
import { LoadingService } from '../../../../core/services/loading/loading.service';

@Component({
  selector: 'app-plant-form',
  imports: [CommonModule,FormsModule],
  templateUrl: './plant-form.component.html',
  styleUrl: './plant-form.component.scss'
})
export class PlantFormComponent {
@Input() showForm = false;
@Input() plantToUpdate:Plant|null = null;
@Output() close = new EventEmitter<void>();
@Output() save = new EventEmitter<Plant>();


// AI recognition state
isRecognizing = false;
aiResult = false;
aiApproved = false;
fillLanguage: 'en' | 'ar' = 'en';
aiSuggestions: { id: number; scientificName:string; commonNames: string[]; confidence: number; thumbnail?: string,imageUrl?:string }[] = [];
selectedSuggestion: { id: number; scientificName:string; commonNames: string[]; confidence: number; thumbnail?: string,imageUrl?:string }|null=null;

// Search state
diseaseSearchQuery = '';
diseaseResults: any[] = [];
isSearchingDiseases = false;
similarPlantSearchQuery = '';
similarPlantResults: any[] = [];
isSearchingPlants = false;

// Keyword draft
keywordDraft = '';
imagePreview='';


languageService=inject(LanguageService);
plantsService=inject(PlantsService);
private toastService = inject(ToastService);
private loadingService = inject(LoadingService);
language = this.languageService.currentLang;
image:File|null=null;
isSaving = false;


newPlant :Plant = this.emptyPlant();
constructor(private plantService:PlantsService){

}




isImageSelected(){
  return this.imagePreview&&this.imagePreview.length!=0&&this.imagePreview != this.plantToUpdate?.imageUrl;
}

showAiRecognitionModel(){
return  this.isImageSelected() && !this.aiResult  &&  !this.selectedSuggestion ;
}
ngOnChanges(changes: SimpleChanges) {
  if (changes['plantToUpdate'] && this.plantToUpdate) {
    console.log("Plant updated", this.plantToUpdate);
    this.initForm();
  }
}
  

  initForm(){
    if(this.plantToUpdate){
      
      this.plantToUpdate.id&& this.plantService.getSimilarPlants(this.plantToUpdate.id).subscribe({
          next:response=>{
              this.newPlant.similarPlants = response.map(sp=>{
                return {
                  scientificName:sp.scientificName,
                  confusableWithId:sp.confusableWithId,
                  reason:sp.reason,
                  imageUrl:sp.imageUrl,
                  name:sp.name
                }
              })
          },
          error:err=>{
            this.toastService.show(this.language()=="en"?"something went wrong when getting the plant from backend":"حدث خطأ أثناء جلب النبتة من الخادم .","error")
          }
      })
      if (this.plantToUpdate.imageUrl) {
      this.imagePreview = this.plantToUpdate.imageUrl;
    }
      this.newPlant={
      name: this.plantToUpdate.name|| '',
    scientificName:this.plantToUpdate.scientificName|| '',
    description: this.plantToUpdate.description||'',
    commonNames: this.plantToUpdate.commonNames || [] as { name: string; region: string }[],
    similarPlants:this.plantToUpdate.similarPlants || [] as { name:string;scientificName: string; reason: string,imageUrl:string }[],
    keywords:this.plantToUpdate.keywords || [],
    translatedDescription:this.plantToUpdate.translatedDescription||"" ,

      }
      if(!this.plantToUpdate.id)
      {
        this.emptyPlant();
      }
    }
  }



onClose() {
  this.newPlant = this.emptyPlant();
  this.clearAiResult();
  this.clearImage();
    this.close.emit();
  }
  
  
  
  onFileSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  this.image = file;
  const reader = new FileReader();
  reader.onload = () => {
    this.imagePreview = reader.result as string;
    this.aiResult = false;
    this.aiApproved = false;
    this.selectedSuggestion = null;
  };
  reader.readAsDataURL(file);
  }

  clearImage() {
  if(this.plantToUpdate&&this.showForm&&this.plantToUpdate.imageUrl != this.imagePreview){
      console.log(this.plantToUpdate.imageUrl != this.imagePreview)
      this.imagePreview = this.plantToUpdate.imageUrl||"";
  }else{
  this.imagePreview= '';
  }
  this.clearAiResult();
  this.image = null;

  
  
}

clearAiResult() {
  this.aiResult = false;
  this.aiApproved = false;
  this.selectedSuggestion = null;
  this.aiSuggestions = [];
  this.newPlant.scientificName = '';
  this.newPlant.commonNames = [];
  
}


runAiRecognition() {
   if(!this.image) return;
  this.isRecognizing = true;
  this.loadingService.show(this.language()=="en" ? "recognizing Plant...":"جارٍ التعرف على النبات…")
  this.plantService.recognizePlant(this.image,this.fillLanguage).subscribe({
    next:response=>{
      console.log(response)
      this.loadingService.hide();
      this.isRecognizing=false;
      this.aiResult=true;
this.aiSuggestions = response.map((p,i)=>{
  return { id: i, scientificName: p.scientificName, commonNames: p.commonNames, confidence: p.score,imageUrl:p.imageUrl,thumbnail:p.imageUrl}
})
    },error:err=>{
      this.loadingService.hide();
      this.isRecognizing=false;
      this.toastService.show(this.language()=="en"?"something went wrong "+err:"حدث خطأ أثناء محاولة التعرف على النبتة باستخدام نموذج الذكاء الاصطناعي، حاول مرة أخرى لاحقًا.","error")
    }
  });

}
selectAiSuggestion(suggestion: any) {
  this.selectedSuggestion = suggestion;
  console.log("sugg : ",this.selectedSuggestion)
}

applyAiSuggestion() {
  if (!this.selectedSuggestion) return;
  // populate fields — wire to real data per your model shape
  this.newPlant.scientificName = this.selectedSuggestion?.scientificName;
  this.newPlant.commonNames = this.selectedSuggestion.commonNames;
  this.aiApproved = true;
  this.aiResult = false;
}
addKeyword() {
  const kw = this.keywordDraft.trim().replace(/,$/, '');
  if (kw && !this.newPlant.keywords.includes(kw)) {
    this.newPlant.keywords = [...this.newPlant.keywords, kw];
  }
  this.keywordDraft = '';
}

removeKeyword(i: number) {
  this.newPlant.keywords = this.newPlant.keywords.filter((_, idx) => idx !== i);
}




searchSimilarPlants(query: string) {
  if (query.length < 2) { this.similarPlantResults = []; return; }
  console.log("sending request")
 this.plantService.simpleSearch(query,6).subscribe({
  next:plants=>{
    console.log("search results", plants)
    this.similarPlantResults = plants;
    console.log("similar result", this.similarPlantResults)

  },error:err=>{
      this.toastService.show(this.language()=="en"?"something went wrong "+err:"حدث خطأ أثناء محاولة العثور على نباتات مشابهة، حاول مرة أخرى لاحقًا.")
    }
 });
}

addSimilarPlant(plant: any) {
  this.newPlant.similarPlants = [...this.newPlant.similarPlants, {...plant,confusableWithId:plant.id}];
  this.similarPlantSearchQuery = '';
  this.similarPlantResults = [];
}

removeSimilarPlant(i: number) {
  this.newPlant.similarPlants = this.newPlant.similarPlants.filter((_, idx) => idx !== i);
}

  onSave(plant:Plant){
    this.save.emit(plant);
  }

emptyPlant() {
  this.plantToUpdate = null;
  return {
    name: '',
    nameAr: '',
    scientificName: '',
    image: '🌿',
    description: '',
    translatedDescription: '',
    commonNames:[],
    similarPlants: [] as { confusableWithId:number,name:string;scientificName: string; reason: ConfusionReason,imageUrl:string }[],
    targetedDiseases: [] as { diseaseName: string; }[],
    keywords:[]
  };
}

addPlant() {
  this.showForm = true;
}

addCommonName(){
  this.newPlant.commonNames.push('');
}

removeCommonName(i: number) {
  this.newPlant.commonNames.splice(i, 1);
}

confusionReasons = [
  { value: ConfusionReason.SIMILAR_LEAVES,  labelEn: 'Similar leaves',  labelAr: 'أوراق مشابهة' },
  { value: ConfusionReason.SIMILAR_FLOWERS, labelEn: 'Similar flowers', labelAr: 'أزهار مشابهة' },
  { value: ConfusionReason.SIMILAR_FRUITS,  labelEn: 'Similar fruits',  labelAr: 'ثمار مشابهة'  },
  { value: ConfusionReason.SAME_FAMILY,     labelEn: 'Same family',     labelAr: 'نفس العائلة'  },
];
savePlant() {
this.isSaving = true;
if(!this.plantToUpdate){
  this.loadingService.show(this.language()=="en"?"Saving Plant ...":"جارٍ حفظ النبات…")
this.plantsService.createPlant(this.newPlant,this.image).subscribe({
  next:savedPlant=>{
  this.isSaving=false;
  this.loadingService.hide();
  this.toastService.show(
      this.language() === 'en' ? 'Plant added successfully!' : 'تمت إضافة النبات بنجاح!',
      'success'
    );

    this.onSave(savedPlant);
    this.onClose();

  },
  error:err=>{
      this.loadingService.hide();
    this.isSaving=false;
    this.toastService.show(
      this.language()  === 'en' ? 'Failed to add plant. Please try again.' : 'فشل إضافة النبات. حاول مرة أخرى.',
      'error'
    );
    console.log(err)
  }
});
}else{
  this.loadingService.show(this.language()=="en" ? 'Updating Plant...':"جارٍ تحديث بيانات النبات…");
  this.plantsService.updatePlant(this.newPlant,this.plantToUpdate.id,this.image).subscribe({
  next:savedPlant=>{
  this.isSaving=false;
  this.toastService.show(
      this.language() === 'en' ? 'Plant updated successfully!' : 'تم تعديل النبات بنجاح',
      'success'
    );
     this.loadingService.hide()

    this.onSave(savedPlant);
    this.onClose();

  },
  error:err=>{
    this.isSaving=false;
         this.loadingService.hide()

    this.toastService.show(
      this.language()  === 'en' ? 'Failed to add plant. Please try again.' : 'فشل إضافة النبات. حاول مرة أخرى.',
      'error'
    );
    console.log(err)
  }
});
}

}
}
