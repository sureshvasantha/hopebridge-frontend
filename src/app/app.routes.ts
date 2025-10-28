import { CampaignListComponent } from "./features/campaigns/campaign-list/campaign-list.component";
import { CampaignDetailComponent } from "./features/campaigns/campaign-detail/campaign-detail.component";
import { LoginComponent } from "./features/auth/login/login.component";
import { RegisterComponent } from "./features/auth/register/register.component";
import { DonationHistoryComponent } from "./features/donations/donation-history/donation-history.component";
import { AdminDashboardComponent } from "./features/admin/dashboard/admin-dashboard.component";
import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";
import { donorGuard, adminGuard } from "./core/guards/role.guard";

export const routes: Routes = [
  { path: "", component: CampaignListComponent },
  { path: "campaigns", component: CampaignListComponent },
  { path: "campaigns/:id", component: CampaignDetailComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  {
    path: "donor/donations",
    canActivate: [authGuard, donorGuard],
    component: DonationHistoryComponent,
  },
  {
    path: "admin/dashboard",
    canActivate: [authGuard, adminGuard],
    component: AdminDashboardComponent,
  },
  { path: "**", redirectTo: "" },
];
