import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentComponent } from './agent.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: AgentComponent,
  },
];

@NgModule({
  declarations: [AgentComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})

export class AgentModule {}
