import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Globals } from '../../utils/globals';
import { DepartmentModel } from '../../../models/department';
import { MessagingService } from '../../providers/messaging.service';

@Component({
  selector: 'app-selection-department',
  templateUrl: './selection-department.component.html',
  styleUrls: ['./selection-department.component.scss']
})

export class SelectionDepartmentComponent implements OnInit {
    // ========= begin:: Input/Output values ===========//
    @Output() eventDepartmentSelected = new EventEmitter<any>();
    @Output() eventClosePage = new EventEmitter();
    // @Input() token: string;
    // ========= end:: Input/Output values ===========//

    // ========= begin:: component variables ======= //
    departments: DepartmentModel[];
    // isLogged: boolean;
    // projectid: string;
    // ========= end:: component variables ======= //

    constructor(
        public g: Globals,
        public messagingService: MessagingService
    ) {
    }

    ngOnInit() {
        console.log('ngOnInit :::: SelectionDepartmentComponent');
        this.getMongDbDepartments();
    }

    /**
     * recupero elenco dipartimenti
     * - recupero il token fisso
     * - mi sottoscrivo al servizio
     * - se c'è un solo dipartimento la setto di default
     * - altrimenti visualizzo la schermata di selezione del dipartimento
    */
    getMongDbDepartments() {
        const that = this;
        console.log('getMongDbDepartments ::::', this.g.projectid);
        this.messagingService.getMongDbDepartments( this.g.projectid )
        .subscribe(
            response => {
                that.departments = response;
                if (that.departments.length === 1) {
                    // DEPARTMENT DEFAULT SEMPRE PRESENTE
                    that.onSelectDepartment(that.departments[0]);
                } else if (that.departments.length === 2) {
                    // UN SOLO DEPARTMENT
                    that.onSelectDepartment(that.departments[1]);
                } else if (that.departments.length > 2) {
                    let i = 0;
                    that.departments.forEach(department => {
                        if (department['default'] === true) {
                            that.departments.splice(i, 1);
                            return;
                        }
                        i++;
                    });
                } else {
                    // DEPARTMENT DEFAULT NON RESTITUISCE RISULTATI
                }
                // that.isLogged = true;
            },
            errMsg => {
                console.log('http ERROR MESSAGE', errMsg);
                // that.isLogged = false;
            },
            () => {
                // console.log('API ERROR NESSUNO');
                // attivo pulsante aprichat!!!!!
            }
        );
    }

    /**
     *
    */
    setDepartment(department) {
        this.g.departmentSelected = department;
        if (this.g.attributes) {
            this.g.attributes.departmentId = department._id;
            this.g.attributes.departmentName = department.name;
            console.log('setAttributes setDepartment: ', JSON.stringify(this.g.attributes));
            localStorage.setItem('attributes', JSON.stringify(this.g.attributes));
        }
    }


    // ========= begin:: ACTIONS ============//
    private onSelectDepartment(department) {
        console.log(' onSelectDepartment: ', department);
        this.setDepartment(department);
        this.eventDepartmentSelected.emit(department);
    }
    closePage() {
        console.log(' closePage: ');
        this.eventClosePage.emit();
    }
    // ========= end:: ACTIONS ============//

}