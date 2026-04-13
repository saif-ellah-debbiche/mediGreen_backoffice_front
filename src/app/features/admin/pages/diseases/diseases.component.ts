import { FormsModule } from '@angular/forms';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../../core/services/language-service/language.service';
import { DiseaseFormComponent } from "../../components/disease-form/disease-form.component";

interface Disease {
  id: number;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  symptoms: string[];
  symptomsAr: string[];
  severity: 'low' | 'medium' | 'high';
  affectedPlants: string[];
}

@Component({
  selector: 'app-diseases',
  templateUrl: './diseases.component.html',
imports: [FormsModule, CommonModule, DiseaseFormComponent],
  styleUrls: ['./diseases.component.scss'],
})
export class DiseasesComponent implements OnInit {
  selectedDisease=null;
  showDiseaseForm=false;
  language: Signal<String>|null=null;
  languageService=inject(LanguageService)
  searchQuery = '';
  expandedId: number | null = null;
  showModal = false;

  diseases: Disease[] = [
    {
      id: 1,
      name: 'Arthritis',
      nameAr: 'التهاب المفاصل',
      description: 'Inflammatory condition affecting joints and connective tissue.',
      descriptionAr: 'حالة التهابية تؤثر على المفاصل والأنسجة الضامة.',
      symptoms: ['Joint pain', 'Swelling', 'Stiffness', 'Reduced mobility'],
      symptomsAr: ['آلام المفاصل', 'التورم', 'الصلابة', 'قلة الحركة'],
      severity: 'high',
      affectedPlants: ['Ginger', 'Turmeric', 'Basil'],
    },
    {
      id: 2,
      name: 'Digestive Issues',
      nameAr: 'مشاكل الجهاز الهضمي',
      description: 'Various conditions affecting stomach and intestinal health.',
      descriptionAr: 'حالات مختلفة تؤثر على صحة المعدة والأمعاء.',
      symptoms: ['Bloating', 'Indigestion', 'Cramping', 'Gas'],
      symptomsAr: ['انتفاخ', 'عسر هضم', 'تقلصات', 'غازات'],
      severity: 'medium',
      affectedPlants: ['Mint', 'Ginger', 'Basil'],
    },
    {
      id: 3,
      name: 'Cough & Cold',
      nameAr: 'السعال والبرد',
      description: 'Respiratory infections causing cough and congestion.',
      descriptionAr: 'التهابات تنفسية تسبب السعال والاحتقان.',
      symptoms: ['Cough', 'Congestion', 'Sore throat', 'Fatigue'],
      symptomsAr: ['سعال', 'احتقان', 'التهاب الحلق', 'إرهاق'],
      severity: 'medium',
      affectedPlants: ['Mint', 'Ginger', 'Basil'],
    },
    {
      id: 4,
      name: 'Inflammation',
      nameAr: 'الالتهاب',
      description: 'General inflammatory response in the body.',
      descriptionAr: 'استجابة التهابية عامة في الجسم.',
      symptoms: ['Redness', 'Warmth', 'Swelling', 'Pain'],
      symptomsAr: ['احمرار', 'دفء', 'تورم', 'ألم'],
      severity: 'high',
      affectedPlants: ['Turmeric', 'Ginger', 'Basil'],
    },
  ];

  constructor() {}


onDiseaseSaved(ev:any){

}

  ngOnInit(): void {
    this.language= this.languageService.currentLang;
  }

  get filteredDiseases(): Disease[] {
    if (!this.searchQuery) return this.diseases;
    const query = this.searchQuery.toLowerCase();
    return this.diseases.filter(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        d.nameAr.includes(query) ||
        d.description.toLowerCase().includes(query)
    );
  }

  toggleExpand(id: number): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  isExpanded(id: number): boolean {
    return this.expandedId === id;
  }

  getSeverityLabel(severity: string): string {
    const labels = {
      low: this.language?.() === 'en' ? 'Low' : 'منخفضة',
      medium: this.language?.()  === 'en' ? 'Medium' : 'متوسطة',
      high: this.language?.()  === 'en' ? 'High' : 'عالية',
    };
    return labels[severity as keyof typeof labels] || '';
  }

  getSeverityColor(severity: string): string {
    const colors = {
      low: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700',
    };
    return colors[severity as keyof typeof colors] || '';
  }

  addDisease(): void {
    this.showDiseaseForm = true;
  }

  editDisease(disease: Disease): void {
    this.showModal = true;
  }

  deleteDisease(id: number): void {
    if (confirm(this.language?.()  === 'en' ? 'Delete this disease?' : 'حذف هذا المرض؟')) {
      this.diseases = this.diseases.filter((d) => d.id !== id);
    }
  }

  getLabel(label: string, labelAr: string): string {
    return this.language?.()  === 'en' ? label : labelAr;
  }
}
