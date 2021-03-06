import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent} from './reports.component';
import { MaterialModule } from '../../material.module';
import { UserReportDialog } from './dialogs/userReportDialog/userReportDialog';
import { OrgReportDialog } from './dialogs/orgReportDialog/orgReportDialog';
import { PrecBlockReportDialog } from './dialogs/precblockReportDialog/precblockReportDialog';
import { ScriptReportDialog } from './dialogs/scriptReportDialog/scriptReportDialog';



const routes: Routes = [
  { path: '', component: ReportsComponent}
];

@NgModule({
  declarations: [ReportsComponent, UserReportDialog, OrgReportDialog, PrecBlockReportDialog, ScriptReportDialog],
  entryComponents: [UserReportDialog, OrgReportDialog, PrecBlockReportDialog, ScriptReportDialog],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes),
  ]
})
export class ReportsModule { }
