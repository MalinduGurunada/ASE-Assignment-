import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductManagementComponent } from './product-management/product-management.component';
import { ReleaseManagementComponent } from './release-management/release-management.component';

const routes: Routes = [
  { path: '', component: ProductManagementComponent },
  { path: 'releases', component: ReleaseManagementComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
