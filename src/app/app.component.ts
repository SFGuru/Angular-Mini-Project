import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { CdkDragStart, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ClickUp';
  formGroup: any = {};
  filterForm: FormGroup;
  columns: any[] = [
    { field: 'id',displayName:'Id',isSortable:false,isAscending:false,sortSequence:0 },
    { field: 'name',displayName:'Name',isSortable:false,isAscending:false,sortSequence:0 },
    { field: 'username',displayName:'User Name',isSortable:false,isAscending:false,sortSequence:0 },
    { field: 'email',displayName:'Email',isSortable:false,isAscending:false,sortSequence:0 },
    { field: 'phone',displayName:'Phone',isSortable:false,isAscending:false,sortSequence:0 },
    { field: 'website',displayName:'Website',isSortable:false,isAscending:false,sortSequence:0 },
    { field: 'status',displayName:'Status',isSortable:false,isAscending:false,sortSequence:0 },
  ];
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = [];
  sortColumns: string[] = [];
  data = [];
  previousIndex: number;

  constructor() { 
    if(localStorage.getItem('sortColumns') !== null){
      this.sortColumns = JSON.parse(localStorage.getItem('sortColumns'));
    }
    if(localStorage.getItem('columns') !== null){
      this.columns = JSON.parse(localStorage.getItem('columns'));
    }
  }

  ngOnInit() {
    const formGroup: any = {};
    this.columns.forEach(col => {
      formGroup[col.field] = new FormControl('');
    });
    this.filterForm = new FormGroup(formGroup);
    this.setDisplayedColumns();
    this.getRemoteData();
    if(this.sortColumns.length > 0){
      this.dataSource.data = this.dataSource.data.sort(this.fieldSorter(this.sortColumns));
    }
  }

  // Get remote serve data using HTTP call
  getRemoteData() {
    const remoteDummyData = [
      {
        "id": 1,
        "name": "Leanne Graham",
        "username": "Bret",
        "email": "Sincere@april.biz",
        "phone": "1-770-736-8031 x56442",
        "website": "hildegard.org",
        "status": "Active"
      },
      {
        "id": 2,
        "name": "Ervin Howell",
        "username": "Antonette",
        "email": "Shanna@melissa.tv",
        "phone": "010-692-6593 x09125",
        "website": "anastasia.net",
        "status": "Blocked"
      },
      {
        "id": 3,
        "name": "Clementine Bauch",
        "username": "Samantha",
        "email": "Nathan@yesenia.net",
        "phone": "1-463-123-4447",
        "website": "ramiro.info",
        "status": "Blocked"
      },
      {
        "id": 4,
        "name": "Patricia Lebsack",
        "username": "Karianne",
        "email": "Julianne.OConner@kory.org",
        "phone": "493-170-9623 x156",
        "website": "kale.biz",
        "status": "Active"
      },
      {
        "id": 5,
        "name": "Chelsey Dietrich",
        "username": "Kamren",
        "email": "Lucio_Hettinger@annie.ca",
        "phone": "(254)954-1289",
        "website": "demarco.info",
        "status": "Active"
      },
      {
        "id": 6,
        "name": "Mrs. Dennis Schulist",
        "username": "Leopoldo_Corkery",
        "email": "Karley_Dach@jasper.info",
        "phone": "1-477-935-8478 x6430",
        "website": "ola.org",
        "status": "In-Active"
      },
      {
        "id": 7,
        "name": "Kurtis Weissnat",
        "username": "Elwyn.Skiles",
        "email": "Telly.Hoeger@billy.biz",
        "phone": "210.067.6132",
        "website": "elvis.io",
        "status": "Active"
      },
      {
        "id": 8,
        "name": "Nicholas Runolfsdottir V",
        "username": "Maxime_Nienow",
        "email": "Sherwood@rosamond.me",
        "phone": "586.493.6943 x140",
        "website": "jacynthe.com",
        "status": "In-Active"
      },
      {
        "id": 9,
        "name": "Glenna Reichert",
        "username": "Delphine",
        "email": "Chaim_McDermott@dana.io",
        "phone": "(775)976-6794 x41206",
        "website": "conrad.com",
        "status": "In-Active"
      },
      {
        "id": 10,
        "name": "Clementina DuBuque",
        "username": "Moriah.Stanton",
        "email": "Rey.Padberg@karina.biz",
        "phone": "024-648-3804",
        "website": "ambrose.net",
        "status": "Active"
      }
    ];
    this.data = remoteDummyData;
    this.dataSource.data = remoteDummyData;
  }

  setDisplayedColumns() {
    this.columns.forEach(( column, index) => {
      column.index = index;
      this.displayedColumns[index] = column.field;
    });
  }

  dragStarted(event: CdkDragStart, index: number ) {
    this.previousIndex = index;
  }

  dropListDropped(event: CdkDragDrop<string[]>, index: number) {
    if (event) {
      moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
      this.setDisplayedColumns();
    }
  }

  handleKeyDown(event,field){
    if(event.key === ' '){
      event.stopPropagation();
    }else if(event.key === 'Enter'){
      event.stopPropagation();
      this.filterData();
    }else{
      return;
    }
  }

  filterData() {
    let filteredData = this.data;
    let filters = this.filterForm.getRawValue();
    let filterFound = false;
    this.columns.forEach(( column, index) => {
      if(filters[column.field] != ''){
        let filterBy = column.field;
        filterFound = true;
        let filterText = filters[column.field];
        filteredData = filteredData.slice().filter(
          (element) => { return JSON.stringify(element[filterBy].toLowerCase()).indexOf(filterText.toLowerCase()) > -1; }
        );
      }
    });
    if(filterFound){
      this.dataSource.data = [...filteredData];
    }else{
      this.dataSource.data = this.data;
    }
  }

  sortData(event,field){
    if(this.sortColumns.length == 0){
      // If no sort column then add 
      this.addSortColumn(field);
    }else{
      if(event.shiftKey){
        // Existing sort column then change the sort direction for the same
        let columnIndex = this.columns.findIndex((c)=>c.field === field);
        if(this.sortColumns.indexOf(field) != -1){
          this.columns[columnIndex].isAscending = !this.columns[columnIndex].isAscending;
        }else{
          // If new column then add to sort column
          this.addSortColumn(field);
        }
      }else{
        if(this.sortColumns.length === 1){
          // If clicked other column for sorting, then reset previous column
          if(field != this.sortColumns[0]){
            let columnIndex = this.columns.findIndex((c)=>c.field === this.sortColumns[0]);
            this.columns[columnIndex].isSortable = false;
            this.columns[columnIndex].isAscending = false;
            this.columns[columnIndex].sortSequence = 0;
            this.sortColumns = [];
            // Add new column to sort columns
            this.addSortColumn(field);
          }else{
            let columnIndex = this.columns.findIndex((c)=>c.field === field);
            this.columns[columnIndex].isAscending = !this.columns[columnIndex].isAscending;
          }
        }else if(this.sortColumns.length > 1){
          // If Already Column in sort then toggle the sort direction
          if(this.sortColumns.indexOf(field) != -1){
            let columnIndex = this.columns.findIndex((c)=>c.field === field);
            this.columns[columnIndex].isAscending = !this.columns[columnIndex].isAscending;
          }else{
            // If column is not in existing sort columns then shift key to be used for multiple sort
            return false;
          }
        }
      }
    }
    this.filterData();
    if(this.sortColumns.length > 0){
      this.dataSource.data = this.dataSource.data.sort(this.fieldSorter(this.sortColumns));
    }else{
      this.dataSource.data = this.data;
    }
    localStorage.setItem('columns',JSON.stringify(this.columns));
    localStorage.setItem('sortColumns',JSON.stringify(this.sortColumns));
  }

  addSortColumn(field){
    let columnIndex = this.columns.findIndex((c)=>c.field === field);
    // Add Column To Sort
    this.sortColumns.push(field);
    this.columns[columnIndex].isSortable = true;
    this.columns[columnIndex].isAscending = !this.columns[columnIndex].isAscending;
    this.columns[columnIndex].sortSequence = this.sortColumns.length;
  }

  clearSort(field){
    let scolIndex = this.sortColumns.indexOf(field);
    if(scolIndex != -1){
      this.sortColumns.splice(scolIndex,1);
      let columnIndex = this.columns.findIndex((c)=>c.field === field);
      this.columns[columnIndex].isSortable = false;
      this.columns[columnIndex].isAscending = false;
      this.columns[columnIndex].sortSequence = 0;
    }
    // If sort with multiple columns then reset sequence value
    this.sortColumns.forEach((field,index)=>{
      let columnIndex = this.columns.findIndex((c)=>c.field === field);
      this.columns[columnIndex].sortSequence = index+1;
    })
    if(this.sortColumns.length > 0){
      this.dataSource.data = this.dataSource.data.sort(this.fieldSorter(this.sortColumns));
    }else{
      this.dataSource.data = this.data;
    }
    localStorage.setItem('columns',JSON.stringify(this.columns));
    localStorage.setItem('sortColumns',JSON.stringify(this.sortColumns));
  }

  fieldSorter = (fields) => (a, b) => fields.map(o => {
    let dir = 1;
    let column = this.columns.find((c)=> c.field === o);
    if(!column.isAscending){
      dir = -1;
    }
    return a[o] > b[o] ? dir : a[o] < b[o] ? -(dir) : 0;
  }).reduce((p, n) => p ? p : n, 0);
}
