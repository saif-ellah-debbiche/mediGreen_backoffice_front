import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBarComponent } from "../components/side-bar/side-bar.component";
import { ToastComponent } from "../../../core/components/toast/toast.component";
import { LoadingComponent } from "../../../core/components/loading/loading.component";

export const metadata = {
  title: 'MediGreen - Medical Plants Admin',
  description: 'Admin dashboard for managing medicinal plants and herbal remedies',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, SideBarComponent, ToastComponent, LoadingComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {

}
