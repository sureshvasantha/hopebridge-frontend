// src/app/app.component.ts
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./shared/components/header/header.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { ToastComponent } from "./shared/components/toast/toast.component";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-root",
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    ToastComponent,
    CommonModule,
  ],
  standalone: true,
  templateUrl: "./app.component.html",
})
export class AppComponent {
  title = "HopeBridge - Online Donation Platform";
}
