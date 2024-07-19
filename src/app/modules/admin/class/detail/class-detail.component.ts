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
import { Observable, take } from 'rxjs';
import { Class } from 'app/types/class.type';
import { FuseCardComponent } from '@fuse/components/card';
import { ClassMember } from 'app/types/class-member.type';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Course } from 'app/types/course.type';
import { CourseService } from '../../course/course.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
@Component({
    selector: 'class-detail',
    standalone: true,
    templateUrl: './class-detail.component.html',
    imports: [CommonModule, FullCalendarModule, FuseCardComponent, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule,
        ReactiveFormsModule, MatDatepickerModule, MatSelectModule],
    providers: [DatePipe]
})
export class ClassDetailComponent implements OnInit {
    class$: Observable<Class>;
    course$: Observable<Course>;
    today = new Date();
    events: any[] = [];
    classForm: UntypedFormGroup;

    calendarOptions: CalendarOptions;

    constructor(
        private _classService: ClassService,
        private _courseService: CourseService,
        private _datePipe: DatePipe,
        private _slotService: SlotService,
        private _dialog: MatDialog,
        private _formBuilder: UntypedFormBuilder
    ) { }

    ngOnInit(): void {
        this.class$ = this._classService.class$;
        this.course$ = this._courseService.course$;
        this._slotService.slots$.subscribe(slots => {
            this.events = this._classService.mapObjects(slots, this._datePipe);
            this.initCalendarOptions();
        });
        this.initClassForm();
    }

    initCalendarOptions() {
        this.calendarOptions = {
            initialView: 'dayGridMonth',
            // validRange: {
            //     start: this.today
            // },
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

    initClassForm() {
        this.class$.pipe(take(1)).subscribe((cl) => {
            this.classForm = this._formBuilder.group({
                name: [cl.name, [Validators.required]],
                from: [cl.from, [Validators.required]],
                to: [{ value: cl.to, disabled: true }, [Validators.required]],
                status: [cl.status, [Validators.required]],
                lessonCount: [{ value: cl.lessonCount, disabled: true }, [Validators.required]],
                totalLesson: [cl.totalLesson, [Validators.required]],
            });
        });
    }
}