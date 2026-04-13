import { CommonModule } from '@angular/common';
import { Component, inject, input, OnChanges, output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoadingService } from '../../../../core/services/loading/loading.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
export interface DiseaseForm {
  name: string;
  description: string;
  symptoms: string[];
  complications: string[];
  prevention: string[];
}
@Component({
  selector: 'app-disease-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './disease-form.component.html',
  styleUrl: './disease-form.component.scss'
})
export class DiseaseFormComponent implements OnChanges {
 showForm   = input.required<boolean>();
  language   = input<String>('en');
  diseaseToUpdate = input<any>(null);

  saved  = output<DiseaseForm>();
  closed = output<void>();

  private loadingService = inject(LoadingService);
  private toastService   = inject(ToastService);

  isSaving = false;

  form: DiseaseForm = this.emptyForm();

  drafts = { symptom: '', complication: '', prevention: '' };


ngOnChanges(changes: SimpleChanges) {
    if (changes['diseaseToUpdate'] && this.diseaseToUpdate()) {
      const d = this.diseaseToUpdate();
      this.form = {
        name:           d.name          ?? '',
        description:    d.description   ?? '',
        symptoms:       [...(d.symptoms      ?? [])],
        complications:  [...(d.complications ?? [])],
        prevention:     [...(d.prevention    ?? [])],
      };
    }

    if (changes['showForm'] && !this.showForm()) {
      this.form   = this.emptyForm();
      this.drafts = { symptom: '', complication: '', prevention: '' };
    }
  }


  private emptyForm(): DiseaseForm {
    return { name: '', description: '', symptoms: [], complications: [], prevention: [] };
  }

  addItem(field: 'symptoms' | 'complications' | 'prevention') {
    this.form[field] = [...this.form[field], ''];
  }

  removeItem(field: 'symptoms' | 'complications' | 'prevention', i: number) {
    this.form[field] = this.form[field].filter((_, idx) => idx !== i);
  }

  commitDraft(field: 'symptoms' | 'complications' | 'prevention', draftKey: keyof typeof this.drafts) {
    const value = this.drafts[draftKey].trim().replace(/,$/, '');
    if (value && !this.form[field].includes(value)) {
      this.form[field] = [...this.form[field], value];
    }
    this.drafts[draftKey] = '';
  }

  onClose() {
    if (this.isSaving) return;
    this.form = this.emptyForm();
    this.drafts = { symptom: '', complication: '', prevention: '' };
    this.closed.emit();
  }

  async save() {
    if (!this.form.name.trim()) {
      this.toastService.show(
        this.language() === 'en' ? 'Disease name is required' : 'اسم المرض مطلوب',
        'error'
      );
      return;
    }

    this.isSaving = true;
    try {
      await this.loadingService.wrap(
        () => Promise.resolve(), // replace with your service call
        this.language() === 'en' ? 'Saving disease...' : 'جاري الحفظ...'
      );
      this.toastService.show(
        this.language() === 'en' ? 'Disease saved successfully' : 'تم حفظ المرض بنجاح',
        'success'
      );
      this.saved.emit({ ...this.form });
      this.onClose();
    } catch {
      this.toastService.show(
        this.language() === 'en' ? 'Failed to save disease' : 'فشل حفظ المرض',
        'error'
      );
    } finally {
      this.isSaving = false;
    }
  }
}
