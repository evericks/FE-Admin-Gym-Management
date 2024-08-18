import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'member',
    templateUrl: './member.component.html',
    standalone: true,
    imports: [MatIconModule]
})
export class MemberComponent implements OnInit {
    constructor(
        public matDialogRef: MatDialogRef<MemberComponent>
    ) { }

    ngOnInit(): void { }
}
