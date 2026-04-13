import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../../core/services/language-service/language.service';

interface PlantInstruction {
  plant: string;
  preparation: string;
  dosage: string;
}

interface Remedy {
  id: number;
  name: string;
  nameAr: string;
  disease: string;
  diseaseAr: string;
  description: string;
  descriptionAr: string;
  plants: PlantInstruction[];
  usageInstructions: string;
  usageInstructionsAr: string;
  duration: string;
  precautions: string[];
  precautionsAr: string[];
}

@Component({
  selector: 'app-remedies',
  templateUrl: './remedies.component.html',
  imports:[FormsModule, CommonModule],
  styleUrls: ['./remedies.component.scss'],
})
export class RemediesComponent implements OnInit {
  language: Signal<String>|null=null;
  languageService=inject(LanguageService)
  searchQuery = '';
  expandedId: number | null = null;
  showModal = false;

  remedies: Remedy[] = [
    {
      id: 1,
      name: 'Ginger Tea for Joint Pain',
      nameAr: 'شاي الزنجبيل لآلام المفاصل',
      disease: 'Arthritis',
      diseaseAr: 'التهاب المفاصل',
      description: 'A warm ginger-based tea that helps reduce joint inflammation and pain.',
      descriptionAr: 'شاي دافئ على أساس الزنجبيل يساعد في تقليل الالتهاب وألم المفاصل.',
      plants: [
        {
          plant: 'Ginger',
          preparation: 'Slice fresh ginger root and steep in hot water for 10 minutes',
          dosage: '1-2 cups daily',
        },
      ],
      usageInstructions: 'Drink warm tea in the morning and evening. Can add honey and lemon for taste.',
      usageInstructionsAr: 'اشرب الشاي الدافئ صباحًا ومساءً. يمكنك إضافة العسل والليمون للطعم.',
      duration: '4-6 weeks for best results',
      precautions: ['Not recommended during pregnancy', 'May cause digestive upset in some'],
      precautionsAr: ['غير موصى به أثناء الحمل', 'قد يسبب اضطراب الجهاز الهضمي عند البعض'],
    },
    {
      id: 2,
      name: 'Turmeric Golden Milk',
      nameAr: 'حليب الكركم الذهبي',
      disease: 'Inflammation',
      diseaseAr: 'الالتهاب',
      description: 'A powerful anti-inflammatory drink combining turmeric with warm milk.',
      descriptionAr: 'مشروب مضاد للالتهابات يجمع بين الكركم والحليب الدافئ.',
      plants: [
        {
          plant: 'Turmeric',
          preparation: 'Mix 1 tsp turmeric powder with warm milk and black pepper',
          dosage: '1 glass daily',
        },
      ],
      usageInstructions: 'Drink before bed for better sleep and overnight recovery.',
      usageInstructionsAr: 'اشرب قبل النوم للحصول على نوم أفضل والتعافي الليلي.',
      duration: 'Ongoing daily use',
      precautions: ['May stain clothes', 'Consult doctor if on blood thinners'],
      precautionsAr: ['قد يلطخ الملابس', 'استشر الطبيب إذا كنت تتناول مسيلات الدم'],
    },
    {
      id: 3,
      name: 'Mint Digestive Tea',
      nameAr: 'شاي النعناع الهضمي',
      disease: 'Digestive Issues',
      diseaseAr: 'مشاكل الجهاز الهضمي',
      description: 'A soothing mint tea that aids digestion and relieves bloating.',
      descriptionAr: 'شاي النعناع المهدئ الذي يساعد الهضم ويخفف الانتفاخ.',
      plants: [
        {
          plant: 'Mint',
          preparation: 'Steep fresh mint leaves in hot water for 5-10 minutes',
          dosage: '2-3 cups daily after meals',
        },
      ],
      usageInstructions: 'Best consumed after meals to aid digestion.',
      usageInstructionsAr: 'الأفضل شربها بعد الوجبات لمساعدة الهضم.',
      duration: '2-4 weeks',
      precautions: ['Avoid if you have GERD', 'May interfere with iron absorption'],
      precautionsAr: ['تجنب إذا كان لديك حموضة المريء', 'قد يتعارض مع امتصاص الحديد'],
    },
    {
      id: 4,
      name: 'Herbal Cough Remedy',
      nameAr: 'علاج السعال العشبي',
      disease: 'Cough & Cold',
      diseaseAr: 'السعال والبرد',
      description: 'A combination remedy for relieving cough and respiratory congestion.',
      descriptionAr: 'علاج مركب لتخفيف السعال واحتقان الجهاز التنفسي.',
      plants: [
        {
          plant: 'Ginger & Basil',
          preparation: 'Boil ginger slices with fresh basil leaves in water, strain and cool slightly',
          dosage: '2 tbsp, 3 times daily',
        },
      ],
      usageInstructions: 'Take warm, preferably with honey. Repeat 3 times daily until symptoms improve.',
      usageInstructionsAr: 'تناول دافئًا، يفضل مع العسل. كرر 3 مرات يوميًا حتى تتحسن الأعراض.',
      duration: '1-2 weeks or until improvement',
      precautions: ['May cause drowsiness', 'Avoid if allergic to herbs'],
      precautionsAr: ['قد يسبب النعاس', 'تجنب إذا كنت تعاني من حساسية من الأعشاب'],
    },
  ];

  constructor() {}

  ngOnInit(): void {
   this.language= this.languageService.currentLang;
  }

  get filteredRemedies(): Remedy[] {
    if (!this.searchQuery) return this.remedies;
    const query = this.searchQuery.toLowerCase();
    return this.remedies.filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        r.nameAr.includes(query) ||
        r.disease.toLowerCase().includes(query) ||
        r.diseaseAr.includes(query)
    );
  }

  toggleExpand(id: number): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  isExpanded(id: number): boolean {
    return this.expandedId === id;
  }

  addRemedy(): void {
    this.showModal = true;
  }

  editRemedy(remedy: Remedy): void {
    this.showModal = true;
  }

  deleteRemedy(id: number): void {
    if (confirm(this.language?.() === 'en' ? 'Delete this remedy?' : 'حذف هذا العلاج؟')) {
      this.remedies = this.remedies.filter((r) => r.id !== id);
    }
  }

  getLabel(label: string, labelAr: string): string {
    return this.language?.() === 'en' ? label : labelAr;
  }
}
