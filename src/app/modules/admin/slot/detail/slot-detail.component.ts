import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Slot } from 'app/types/slot.type';
import { Observable, take, tap } from 'rxjs';
import { SlotService } from '../slot.service';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'slot-detail',
    templateUrl: './slot-detail.component.html',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule]
})
export class SlotDetailComponent implements OnInit {

    slots$: Observable<Slot>;
    slotUpdateForm: UntypedFormGroup;

    constructor(
        public matDialogRef: MatDialogRef<SlotDetailComponent>,
        private _slotService: SlotService,
        private _formBuilder: UntypedFormBuilder
    ) { }

    ngOnInit(): void {
        this.slots$ = this._slotService.slot$;
        this.initSlotUpdateForm();
    }

    initSlotUpdateForm() {
        this.slots$.pipe(take(1)).subscribe(slot => {
            this.slotUpdateForm = this._formBuilder.group({
                id: [slot.id, [Validators.required]],
                name: [slot.name, [Validators.required]],
                startTime: [slot.startTime, [Validators.required]],
                endTime: [{ value: slot.endTime, disabled: true }, [Validators.required]],
            });
        })
    }

    updateSlot(id: string) {
        this._slotService.updateSlot(id, this.slotUpdateForm.value).subscribe(() => {
            this.matDialogRef.close()
        })
    }
}
