import { Component, AfterViewInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DashboardService } from '../Services/dashboard.service';
import { SnackbarService } from '../Services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';


@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
	responseMessage:any;
	data:any;

	ngAfterViewInit() { }

	constructor(private dashboardservice:DashboardService,
		private ngxservice:NgxUiLoaderService,
		private snakbarservice:SnackbarService) {
			this.ngxservice.start();
			this.dashboardData();
			
	}

	dashboardData(){
		this.dashboardservice.getDetails().subscribe((Response:any)=>{
			this.ngxservice.stop();
			this.data = Response
		},(error:any)=>{
			this.ngxservice.stop();
			console.log(error);
			if (error.error?.message){
				this.responseMessage = error.error?.message;
			}
			else{
				this.responseMessage = GlobalConstants.genericError;
			}
			this.snakbarservice.opensnackbar(this.responseMessage,GlobalConstants.error);
		})
	}
}
