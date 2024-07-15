import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ClassService } from '../class.service';
import { SlotService } from '../../slot/slot.service';
import { MatDialog } from '@angular/material/dialog';
import { SlotDetailComponent } from '../../slot/detail/slot-detail.component';
@Component({
    selector: 'class-detail',
    standalone: true,
    templateUrl: './class-detail.component.html',
    imports: [CommonModule, FullCalendarModule],
    providers: [DatePipe]
})
export class ClassDetailComponent implements OnInit {
    today = new Date();
    events: any[] = [];

    calendarOptions: CalendarOptions;

    constructor(
        private _classService: ClassService,
        private _datePipe: DatePipe,
        private _slotService: SlotService,
        private _dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this._slotService.slots$.subscribe(slots => {
            this.events = this._classService.mapObjects(slots, this._datePipe);
            this.initCalendarOptions();
        })
    }

    initCalendarOptions() {
        this.calendarOptions = {
            initialView: 'dayGridMonth',
            validRange: {
                start: this.today
            },
            buttonText: {
                today: 'To day',
                next: 'Next Month',
                prev: 'Previous Month',
            },
            plugins: [dayGridPlugin, interactionPlugin],
            eventClick: (arg) => this.handleEventClick(arg),
            events: this.events
        };
    }

    handleEventClick(arg: EventClickArg) {
        const id = arg.event._def.extendedProps.publicId;
        this._slotService.getSlotById(id).subscribe(() => {
            this._dialog.open(SlotDetailComponent, {
                width: '720px'
            })
        })
    }
}
