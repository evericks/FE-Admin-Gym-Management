import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { MemberComponent } from 'app/modules/admin/member/member.component';
import { MemberService } from './member.service';

export default [
    {
        path: '',
        component: MemberComponent,
        resolve: {
            member: () => inject(MemberService).getMembers(),
        }
    },
] as Routes;
