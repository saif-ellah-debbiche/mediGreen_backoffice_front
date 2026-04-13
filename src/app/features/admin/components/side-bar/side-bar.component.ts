import { Component, OnInit, Signal } from '@angular/core';
import { Language, LanguageService } from '../../../../core/services/language-service/language.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavItem {
  label: string;
  labelAr: string;
  href: string;
  icon: string;
  badge?: number;
}

interface NavSection {
  title: string;
  titleAr: string;
  items: NavItem[];
}

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent implements OnInit {
 isOpen = false;
  expandedSection: string | null = 'plants';
  language: Signal<String>|null=null;

  navSections: NavSection[] = [
    {
      title: 'Management',
      titleAr: 'الإدارة',
      items: [
        {
          label: 'Dashboard',
          labelAr: 'لوحة المعلومات',
          href: '/admin',
          icon: 'bar-chart-3',
        },
        {
          label: 'Plants',
          labelAr: 'النباتات',
          href: '/admin/plants',
          icon: 'leaf',
          badge: 24,
        },
      ],
    },
    {
      title: 'Health',
      titleAr: 'الصحة',
      items: [
        {
          label: 'Diseases',
          labelAr: 'الأمراض',
          href: '/admin/diseases',
          icon: 'stethoscope',
          badge: 12,
        },
        {
          label: 'Remedies',
          labelAr: 'العلاجات',
          href: '/admin/remedies',
          icon: 'pill',
          badge: 18,
        },
      ],
    },
  ];

  constructor(
    private languageService: LanguageService,
    private router: Router
  ) {}

  ngOnInit(): void {
      this.language = this.languageService.currentLang;

  }

  toggleSection(section: string): void {
    this.expandedSection =
      this.expandedSection === section ? null : section;
  }

  getLabel(item: NavItem): string {
    return this.language?.() === 'en' ? item.label : item.labelAr;
  }

  getSectionTitle(title: string, titleAr: string): string {
    return this.language?.() === 'en' ? title : titleAr;
  }

  setLanguage(lang: Language): void {
    this.languageService.switchLanguage(lang);
  }

  isLanguageActive(lang: String): boolean {
    return this.language?.() === lang;
  }

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  navigate(href: string): void {
    this.router.navigate([href]);
    if (window.innerWidth < 768) {
      this.isOpen = false;
    }
  }

  getIcon(iconName: string): string {
    const icons: { [key: string]: string } = {
      'bar-chart-3': '📊',
      'leaf': '🌿',
      'stethoscope': '🩺',
      'pill': '💊',
    };
    return icons[iconName] || '•';
  }
}
