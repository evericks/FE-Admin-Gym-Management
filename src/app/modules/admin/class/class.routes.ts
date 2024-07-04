import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { ClassComponent } from 'app/modules/admin/class/class.component';
import { ClassService } from './class.service';

export default [
    {
        path: '',
        component: ClassComponent,
        resolve: {
            class: () => inject(ClassService).getClasss(),
        }
    },
] as Routes;
