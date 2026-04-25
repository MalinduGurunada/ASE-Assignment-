import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RollbacksComponent } from './rollbacks/rollbacks.component';
import { TrackingComponent } from './tracking/tracking.component';

const routes: Routes = [
  { path: '', component: TrackingComponent },
  { path: 'rollbacks', component: RollbacksComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeploymentRoutingModule { }
