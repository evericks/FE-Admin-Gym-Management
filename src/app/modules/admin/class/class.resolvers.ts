import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SlotService } from '../slot/slot.service';
import { ClassService } from './class.service';

@Injectable({
    providedIn: 'root',
})
export class ClassResolver implements Resolve<any> {
    constructor(private classService: ClassService, private slotService: SlotService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const classId = route.params['id'];
        return this.classService.getClassById(classId).pipe(
            switchMap(classData =>
                this.slotService.getSlots({ classId: classId, pagination: { pageSize: 999 } }).pipe(
                    map(slots => ({
                        class: classData,
                        slots
                    }))
                )
            )
        );
    }
}
