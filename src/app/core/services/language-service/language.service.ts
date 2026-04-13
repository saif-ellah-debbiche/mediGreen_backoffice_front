import { Injectable, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Language = 'en' | 'ar';

@Injectable({ providedIn: 'root' })
export class LanguageService {

  private doc = inject(DOCUMENT);

  // signal() is Angular's modern reactive primitive — like a useState that
  // Angular's change detection understands natively.
  // Reading it in a template or computed() automatically tracks the dependency.
  private _currentLang = signal<Language>(this.getInitialLang());

  // Public read-only view — components can read but not write directly
  readonly currentLang = this._currentLang.asReadonly();

  constructor() {
    // Apply the saved language immediately when the service is first created
    // (which happens before any component renders)
    this.applyToDocument(this._currentLang());
  }

  switchLanguage(lang: Language): void {
    this._currentLang.set(lang);
    this.applyToDocument(lang);
    localStorage.setItem('language', lang);
  }

  private applyToDocument(lang: Language): void {
    const html = this.doc.documentElement;

    html.lang = lang;
    html.dir  = lang === 'ar' ? 'rtl' : 'ltr';
    // This single dir change on <html> flips the entire layout —
    // every logical CSS property (margin-inline-start, padding-inline-end,
    // text-align: start, etc.) in every component responds automatically.
  }
  private applyRTL(isRTL: boolean): void {
    if (isRTL) {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    }
  }

  private getInitialLang(): Language {
    // 1. Check what the user chose last time
    const saved = localStorage.getItem('language') as Language | null;
    if (saved === 'ar' || saved === 'en') return saved;

    // 2. Fall back to Arabic as the app's default language
    return 'ar';
  }
}