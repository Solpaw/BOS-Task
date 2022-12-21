import { HasContractFilterEnum, IUserModel } from '../../models/user.models';
import { UserService } from './../../services/user.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { filterFirstAndLastName } from 'src/app/helpers/helpers';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-character-search',
  templateUrl: './character-search.component.html',
  styleUrls: ['./character-search.component.scss']
})
export class CharacterSearchComponent implements OnInit, OnDestroy {

  filters = new FormGroup({
    searchTerm: new FormControl<string>('', { nonNullable: true }),
    filterHasContract: new FormControl<HasContractFilterEnum>(HasContractFilterEnum.All, { nonNullable: true }),
  })

  availableUsers: IUserModel[] = [];
  filteredUsers: IUserModel[] = [];
  displayUsers: IUserModel[] =[];
  isLoading: boolean = false;
  pageNumber: number = 0;
  maxPageNumber: number = 0;
  selectedUser?: IUserModel;
  sub = new Subscription();

  constructor(private userService: UserService, private modalService: NgbModal) { }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ngOnInit() {
    this.fetchData();
    this.sub.add(this.filters.get('searchTerm')?.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.filterPage()
    }));
    this.sub.add(this.filters.get('filterHasContract')?.valueChanges.subscribe(() => {
      this.filterPage()
    }));
  }

  changePage(pageNumber: number) {
    this.pageNumber = pageNumber;
    const startIndex = this.userService.pageSize * pageNumber;
    const endIndex = this.userService.pageSize * pageNumber + this.userService.pageSize;
    this.displayUsers = this.filteredUsers.slice(startIndex, endIndex);
    if(!this.displayUsers.length && pageNumber > 0) {
      this.changePage(--pageNumber);
    }
  }

  fetchData() {
    this.isLoading = true;
    this.sub.add(this.userService.getUsers().subscribe(res => {
      this.availableUsers = res;
      this.filterPage();
      this.isLoading = false;
    }))
  }

  nextPage() {
    this.changePage(this.pageNumber + 1);
  }

  previousPage() {
    this.changePage(this.pageNumber - 1);
  }

  filterPage(page?: number) {
    const filters = this.filters.getRawValue();
    this.filteredUsers = this.availableUsers.filter(ele => {
      switch(filters.filterHasContract) {
        case HasContractFilterEnum.All:
          return filterFirstAndLastName(ele, filters.searchTerm);
        case HasContractFilterEnum.Contract:
          return ele.hasContract && filterFirstAndLastName(ele, filters.searchTerm);
        case HasContractFilterEnum.NoContract:
          return !ele.hasContract && filterFirstAndLastName(ele, filters.searchTerm);
        default:
          return true;

      }
    });
    this.getMaxPageNumber();
    this.changePage(page ?? 0);
  }

  refreshData() {
    this.fetchData();
  }

  removeItem(id: string) {
    this.availableUsers = this.availableUsers.filter(ele => ele.id !== id);
    this.filterPage(this.pageNumber);
  }

  getMaxPageNumber() {
    const fullPages = Math.floor(this.filteredUsers.length / this.userService.pageSize);
    this.maxPageNumber = this.filteredUsers.length % this.userService.pageSize === 0 ? fullPages - 1 : fullPages;
  }

  openDetails(content: any, user: IUserModel) {
    this.selectedUser = user;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  checkIfBirthday(birthday: string) {
    const currentMonth = new Date().getMonth();
    return new Date(birthday).getMonth() === currentMonth;
  }
}
