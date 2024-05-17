import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { AdminComponent } from './layouts/admin/admin.component';
import { AuthComponent } from './layouts/auth/auth.component';
import { LeaveGuard } from './leaved/leaved.guard';
import { SetupAuthGuard } from './setupGuard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'city',
        loadChildren: () => import('./pages/cities/cities.module').then(m => m.CitiesModule)
      },
      {
        path: 'users',
        loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule)
      },
      {
        path: 'stores',
        loadChildren: () => import('./pages/stores/stores.module').then(m => m.StoresModule)
      },
      {
        path: 'orders',
        loadChildren: () => import('./pages/orders/orders.module').then(m => m.OrdersModule)
      },
      {
        path: 'drivers',
        loadChildren: () => import('./pages/drivers/drivers.module').then(m => m.DriversModule)
      },
      {
        path: 'offers',
        loadChildren: () => import('./pages/offers/offers.module').then(m => m.OffersModule)
      },
      {
        path: 'banners',
        loadChildren: () => import('./pages/banners/banners.module').then(m => m.BannersModule)
      },
      {
        path: 'contacts',
        loadChildren: () => import('./pages/contacts/contacts.module').then(m => m.ContactsModule),
        canDeactivate: [LeaveGuard]
      },
      {
        path: 'notifications',
        loadChildren: () => import('./pages/notifications/notifications.module').then(m => m.NotificationsModule)
      },
      {
        path: 'stats',
        loadChildren: () => import('./pages/stats/stats.module').then(m => m.StatsModule)
      },
      {
        path: 'manage-users',
        loadChildren: () => import('./pages/manage-users/manage-users.module').then(m => m.ManageUsersModule)
      },
      {
        path: 'branch-managers',
        loadChildren: () => import('./pages/branch-managers/branch-managers.module').then(m => m.BranchManagersModule)
      },
      {
        path: 'agents',
        loadChildren: () => import('./pages/agent/agent.module').then(m => m.AgentModule)
      },
      {
        path: 'manage-stores',
        loadChildren: () => import('./pages/manage-stores/manage-stores.module').then(m => m.ManageStoresModule)
      },
      {
        path: 'manage-orders',
        loadChildren: () => import('./pages/manage-orders/manage-orders.module').then(m => m.ManageOrdersModule)
      },
      {
        path: 'manage-drivers',
        loadChildren: () => import('./pages/manage-drivers/manage-drivers.module').then(m => m.ManageDriversModule)
      },
      {
        path: 'manage-offers',
        loadChildren: () => import('./pages/manage-offers/manage-offers.module').then(m => m.ManageOffersModule)
      },
      {
        path: 'manage-banners',
        loadChildren: () => import('./pages/manage-banners/manage-banners.module').then(m => m.ManageBannersModule)
      },
      {
        path: 'manage-city',
        loadChildren: () => import('./pages/manage-city/manage-city.module').then(m => m.ManageCityModule)
      },
      {
        path: 'manage-contacts',
        loadChildren: () => import('./pages/manage-contacts/manage-contacts.module').then(m => m.ManageContactsModule)
      },
      {
        path: 'category',
        loadChildren: () => import('./pages/category/category.module').then(m => m.CategoryModule)
      },
      {
        path: 'major-categories',
        loadChildren: () => import('./pages/major-categories/major-categories.module').then(m => m.MajorCategoriesModule)
      },
      {
        path: 'minor-categories',
        loadChildren: () => import('./pages/minor-categories/minor-categories.module').then(m => m.MinorCategoriesModule)
      },
      {
        path: 'cuisines',
        loadChildren: () => import('./pages/cuisines/cuisines.module').then(m => m.CuisinesModule)
      },
      {
        path: 'manage-major-categories',
        loadChildren: () => import('./pages/manage-major-categories/manage-major-categories.module').then(m => m.ManageMajorCategoriesModule)
      },
      {
        path: 'manage-minor-categories',
        loadChildren: () => import('./pages/manage-minor-categories/manage-minor-categories.module').then(m => m.ManageMinorCategoriesModule)
      },
      {
        path: 'manage-cuisines',
        loadChildren: () => import('./pages/manage-cuisines/manage-cuisines.module').then(m => m.ManageCuisinesModule)
      },
      {
        path: 'languages',
        loadChildren: () => import('./pages/languages/languages.module').then(m => m.LanguagesModule)
      },
      {
        path: 'manage-languages',
        loadChildren: () => import('./pages/manage-languages/manage-languages.module').then(m => m.ManageLanguagesModule)
      },
      {
        path: 'manage-app',
        loadChildren: () => import('./pages/manage-app/manage-app.module').then(m => m.ManageAppModule)
      },
      {
        path: 'send-mail',
        loadChildren: () => import('./pages/send-email/send-email.module').then(m => m.SendEmailModule)
      },
      {
        path: 'alert-notification',
        loadChildren: () => import('./pages/alert-notification/alert-notification.module').then(m => m.AlertNotificationModule)
      },
      {
        path: 'restaurant-products',
        loadChildren: () => import('./pages/store-products/store-products.module').then(m => m.StoreProductsModule)
      },
      {
        path: 'restaurant-cuisines',
        loadChildren: () => import('./pages/store-cuisines/store-cuisines.module').then(m => m.StoreCuisinesModule)
      },
      {
        path: 'app-settings',
        loadChildren: () => import('./pages/app-settings/app-settings.module').then(m => m.AppSettingsModule)
      },
      {
        path: 'general',
        loadChildren: () => import('./pages/app-web/app-web.module').then(m => m.AppWebModule)
      },
      {
        path: 'custom-sort',
        loadChildren: () => import('./pages/custom-sort/custom-sort.module').then(m => m.CustomSortModule)
      },
      {
        path: 'products',
        loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsModule)
      },
      {
        path: 'manage-products',
        loadChildren: () => import('./pages/manage-products/manage-products.module').then(m => m.ManageProductsModule)
      },
      {
        path: 'silver-display',
        loadChildren: () => import('./pages/silver-display/silver-display.module').then(m => m.SilverDisplayModule)
      },
      {
        path: 'zones',
        loadChildren: () => import('./pages/zones/zones.module').then(m => m.ZonesModule)
      },
      {
        path: 'manage-zones',
        loadChildren: () => import('./pages/manage-zones/manage-zones.module').then(m => m.ManageZonesModule)
      },
      {
        path: 'payment',
        loadChildren: () => import('./pages/payments/payments.module').then(m => m.PaymentsModule)
      },
      {
        path: 'manage-payment',
        loadChildren: () => import('./pages/manage-payment/manage-payment.module').then(m => m.ManagePaymentModule)
      },
      {
        path: 'app-pages',
        loadChildren: () => import('./pages/app-pages/app-pages.module').then(m => m.AppPagesModule)
      },
      {
        path: 'manage-app-pages',
        loadChildren: () => import('./pages/manage-app-pages/manage-app-pages.module').then(m => m.ManageAppPagesModule)
      },
      {
        path: 'driver-stats',
        loadChildren: () => import('./pages/driver-stats/driver-stats.module').then(m => m.DriverStatsModule)
      },
      {
        path: 'emails',
        loadChildren: () => import('./pages/emails/emails.module').then(m => m.EmailsModule)
      },
      {
        path: 'emails-details',
        loadChildren: () => import('./pages/emails-details/emails-details.module').then(m => m.EmailsDetailsModule)
      },
      {
        path: 'manage-popup',
        loadChildren: () => import('./pages/manage-popup/manage-popup.module').then(m => m.ManagePopupModule)
      },
      {
        path: 'administrantor',
        loadChildren: () => import('./pages/administrator/administrator.module').then(m => m.AdministratorModule)
      },
      {
        path: 'manage-administrantor',
        loadChildren: () => import('./pages/manage-admin/manage-admin.module').then(m => m.ManageAdminModule)
      },
      {
        path: 'blogs',
        loadChildren: () => import('./pages/blogs/blogs.module').then(m => m.BlogsModule)
      },
      {
        path: 'blog-details',
        loadChildren: () => import('./pages/blogs-details/blogs-details.module').then(m => m.BlogsDetailsModule)
      }
      //
    ]
  },
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
        canActivate: [SetupAuthGuard]
      },
      // , {
      //   path: 'report',
      //   loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule)
      // },
      {
        path: 'setup',
        loadChildren: () => import('./pages/setup/setup.module').then(m => m.SetupModule)
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
