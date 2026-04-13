import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { LanguageService } from '../../../../core/services/language-service/language.service';

interface Stat {
  label: string;
  labelAr: string;
  value: number;
  change: number;
  icon: string;
  color: string;
}

interface Plant {
  id: number;
  name: string;
  nameAr: string;
  scientificName: string;
  image: string;
  addedDate: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
   imports: [CommonModule],
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  language: Signal<String>|null=null;
  languageService=inject(LanguageService);

  stats: Stat[] = [
    {
      label: 'Total Plants',
      labelAr: 'إجمالي النباتات',
      value: 1250,
      change: 12,
      icon: '🌿',
      color: 'text-green-600',
    },
    {
      label: 'Diseases',
      labelAr: 'الأمراض',
      value: 156,
      change: 8,
      icon: '🩺',
      color: 'text-blue-600',
    },
    {
      label: 'Remedies',
      labelAr: 'العلاجات',
      value: 89,
      change: 15,
      icon: '💊',
      color: 'text-amber-600',
    },
    {
      label: 'Users',
      labelAr: 'المستخدمون',
      value: 342,
      change: 5,
      icon: '👥',
      color: 'text-purple-600',
    },
  ];

  recentPlants: Plant[] = [
    {
      id: 1,
      name: 'Ginger',
      nameAr: 'الزنجبيل',
      scientificName: 'Zingiber officinale',
      image: '🌿',
      addedDate: '2024-03-15',
    },
    {
      id: 2,
      name: 'Turmeric',
      nameAr: 'الكركم',
      scientificName: 'Curcuma longa',
      image: '🌾',
      addedDate: '2024-03-14',
    },
    {
      id: 3,
      name: 'Basil',
      nameAr: 'الريحان',
      scientificName: 'Ocimum basilicum',
      image: '🍃',
      addedDate: '2024-03-13',
    },
    {
      id: 4,
      name: 'Mint',
      nameAr: 'النعناع',
      scientificName: 'Mentha piperita',
      image: '🌿',
      addedDate: '2024-03-12',
    },
  ];

  constructor() {}

  ngOnInit(): void {
    const savedLanguage = localStorage.getItem('language') as 'en' | 'ar' | null;
    if (savedLanguage) {
      this.language = this.languageService.currentLang;
    }
  }

  getLabel(label: string, labelAr: string): string {
    return this.language?.() === 'en' ? label : labelAr;
  }
}