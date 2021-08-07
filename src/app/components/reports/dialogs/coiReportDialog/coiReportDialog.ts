import { Component, OnInit, ViewChild, ElementRef, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ReportService} from '../../../../services/report/report.service'
import { Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {ScriptService} from '../../../../services/script/script.service';
import {OrganizationService} from '../../../../services/organization/organization.service';
import {Organization} from '../../../../models/organizations/organization.model';

@Component({
    templateUrl: './coiReportDialog.html',
  })

export class COIReportDialog implements OnInit {

    sortedMembers;
    pageEvent: PageEvent;
  
    currentPage: number = 0
    public pageSize: number = 5;
    public totalSize: number = 0;

    members = [];
    activityID: string = '';

    completed: boolean = true;

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild('reportPickerStart', {static: false}) reportPickerStart: ElementRef;
    @ViewChild('reportPickerEnd', {static: false}) reportPickerEnd: ElementRef;

    constructor(public scriptService: ScriptService,
                public dialogRef: MatDialogRef<COIReportDialog>,
                @Inject(MAT_DIALOG_DATA) public data,
                public dialog: MatDialog,
                public reportService: ReportService,
                public orgService: OrganizationService
              ) {}

    getCOIReport(){
        var campaignID: number = parseInt(sessionStorage.getItem('campaignID'));
        var orgID: string = sessionStorage.getItem('orgID');

        var reportPickerStart = '';
        if (this.reportPickerStart){var reportPickerStart = this.reportPickerStart['startAt'] ? new Date(this.reportPickerStart['startAt']).toISOString().slice(0, 10) : ''}
        var reportPickerEnd = '';
        if (this.reportPickerEnd){var reportPickerEnd = this.reportPickerEnd['startAt'] ? new Date(this.reportPickerEnd['startAt']).toISOString().slice(0, 10) : ''}

        var mode = this.data.mode
        this.completed = true;

        this.reportService.getCOIReport(campaignID, mode, orgID, reportPickerStart, reportPickerEnd).subscribe(
            async (report: unknown[]) =>{

                this.members = [];
                this.sortedMembers = [];

                this.members = report

                this.sortedMembers = this.members.slice();
                this.totalSize = this.members.length;
                this.iterator();

                /*
                this.orgService.getCampaignOrgs(campaignID).subscribe(
                    async (orgs: Organization[]) => {


                        for(var i = 0; i < report.length; i++){
                            // Create arrays
                            report[i]['scripts'] = {};

                            // Get org name
                            for await (let org of orgs) {
                                if (org._id === report[i]['_id']){

                                    // Loop through scripts
                                    for await (let questions of this.data.selectedScript.questions) {
                                        if (questions.responses.length) {
                                            for await (let response of questions.responses) {
                                                for (let IDS of report[i][response.idType]) {
                                                    if(IDS[questions._id] !== undefined){
                                                        report[i]['scripts'][questions.question + ' - ' + response.response] = IDS[questions._id];
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    report[i]['scripts']['IMP'] = report[i]['IMP'];
                                    report[i]['scripts']['Invalid Phone'] = report[i]['INVALIDPHONE'];
                                    report[i]['scripts']['DNC'] = report[i]['DNC'];
                                    report[i]['scripts']['NonResponse'] = report[i]['NONRESPONSE'];

                                    await this.members.push({
                                        'Org Name': org.name,
                                        ...report[i]['scripts'],
                                    });

                                    this.sortedMembers = this.members.slice();
                                    this.totalSize = this.members.length;
                                    this.iterator();
                                }
                            }
                        }

                        if (!report.length && !reportPickerStart && !reportPickerEnd) {
                            this.completed = false;
                        }
                    }
                );

                */
            }
        );

    }

    public handlePage(e: any) {
        this.currentPage = e.pageIndex;
        this.pageSize = e.pageSize;
        this.iterator();
        return e
    }

    private iterator() {
        const end = (this.currentPage + 1) * this.pageSize;
        const start = this.currentPage * this.pageSize;
        const part = this.members.slice(start, end);
        this.sortedMembers = part;
    }

    sortData(sort: Sort) {
        const data = this.members.slice();
        if (!sort.active || sort.direction === '') {
            this.sortedMembers = data;
            return;
        }

        this.sortedMembers = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            return compare(a[sort.active], b[sort.active], isAsc)
        });

        this.sortedMembers.paginator = this.paginator;
    }

    filterByDate() {
        this.getCOIReport();
    }

    returnZero() {
        return 0;
    }

    async ngOnInit() {
        this.getCOIReport()
    }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
