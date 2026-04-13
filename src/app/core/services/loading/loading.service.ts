import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private _loading = signal(false);
  private _message = signal('');

  isLoading = this._loading.asReadonly();
  message = this._message.asReadonly();

  show(message = '') {
    this._message.set(message);
    this._loading.set(true);
  }

  hide() {
    this._loading.set(false);
    this._message.set('');
  }

  async wrap<T>(fn: () => Promise<T>, message = ''): Promise<T> {
    this.show(message);
    try {
      return await fn();
    } finally {
      this.hide();
    }
  }
}
