import { CampaignListComponent } from "./features/campaigns/campaign-list/campaign-list.component";
import { CampaignDetailComponent } from "./features/campaigns/campaign-detail/campaign-detail.component";
import { LoginComponent } from "./features/auth/login/login.component";
import { RegisterComponent } from "./features/auth/register/register.component";
import { DonationHistoryComponent } from "./features/donations/donation-history/donation-history.component";
import { AdminDashboardComponent } from "./features/admin/dashboard/admin-dashboard.component";
import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";
import { donorGuard, adminGuard } from "./core/guards/role.guard";
import { DonationSuccessComponent } from "./features/donations/donation-success/donation-success.component";
import { StoryListComponent } from "./features/impact-stories/story-list/story-list.component";
import { StoryDetailComponent } from "./features/impact-stories/story-detail/story-detail.component";
import { MyProfileComponent } from "./features/auth/my-profile/my-profile.component";
import { CampaignFormComponent } from "./features/admin/campaign-form/campaign-form.component";

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
    path: "impact-stories",
    canActivate: [authGuard],
    component: StoryListComponent,
  },
  {
    path: "impact-stories/:id",
    canActivate: [authGuard],
    component: StoryDetailComponent,
  },
  {
    path: "donation-success",
    canActivate: [authGuard, donorGuard],
    component: DonationSuccessComponent,
  },
  {
    path: "admin",
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: "dashboard",
        component: AdminDashboardComponent,
      },
      {
        path: "campaigns",
        children: [
          {
            path: "new",
            component: CampaignFormComponent,
          },
          {
            path: ":id/edit",
            component: CampaignFormComponent,
          },
        ],
      },
    ],
  },
  {
    path: "profile",
    canActivate: [authGuard],
    component: MyProfileComponent,
  },

  { path: "**", redirectTo: "" },
];
