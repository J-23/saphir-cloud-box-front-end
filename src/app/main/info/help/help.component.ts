import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { FuseUtils } from '@fuse/utils';
import { InfoService } from '../info.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HelpComponent implements OnInit, OnDestroy {

  faqs: any;
  faqsFiltered: any;
  step: number;
  searchInput: any;

  private _unsubscribeAll: Subject<any>;

  constructor(private infoService: InfoService) { 
    this.searchInput = new FormControl('');
    this.step = 0;

    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {

    this.infoService.onFaqsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.faqs = response;
        this.faqsFiltered = response;
      });

    this.searchInput.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        distinctUntilChanged()
        )
      .subscribe(searchText => {
        this.faqsFiltered = FuseUtils.filterArrayByString(this.faqs, searchText);
      });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep(): void {
    this.step++;
  }

  prevStep(): void {
    this.step--;
  }
}
