import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
	{
		path: 'auth',
		loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule)
	},
	{
		path: 'dashboard',
		canActivate: [authGuard],
		loadChildren: () => import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule)
	},
	{
		path: 'products',
		canActivate: [authGuard],
		loadChildren: () => import('./features/product/product.module').then((m) => m.ProductModule)
	},
	{
		path: 'deployments',
		canActivate: [authGuard],
		loadChildren: () => import('./features/deployment/deployment.module').then((m) => m.DeploymentModule)
	},
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'dashboard'
	},
	{
		path: '**',
		redirectTo: 'dashboard'
	}
];
