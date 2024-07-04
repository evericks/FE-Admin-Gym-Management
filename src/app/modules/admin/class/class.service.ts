import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Class } from 'app/types/class.type';
import { Pagination } from 'app/types/pagination.type';
import { BehaviorSubject, Observable, map, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClassService {

    private _class: BehaviorSubject<Class | null> = new BehaviorSubject(null);
    private _classes: BehaviorSubject<Class[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) { }

    /**
 * Getter for class
 */
    get class$(): Observable<Class> {
        return this._class.asObservable();
    }

    /**
     * Getter for classes
     */
    get classes$(): Observable<Class[]> {
        return this._classes.asObservable();
    }

    /**
 * Getter for pagination
 */
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    getClasss(filter: any = {}):
        Observable<{ pagination: Pagination; data: Class[] }> {
        return this._httpClient.post<{ pagination: Pagination; data: Class[] }>('/api/admin/classes/filter', filter).pipe(
            tap((response) => {
                this._pagination.next(response.pagination);
                this._classes.next(response.data);
            }),
        );
    }

    /**
     * Get class by id
     */
    getClassById(id: string): Observable<Class> {
        return this.classes$.pipe(
            take(1),
            switchMap(() => this._httpClient.get<Class>('/api/admin/classes/' + id).pipe(
                map((cl) => {

                    // Set value for current class
                    this._class.next(cl);

                    // Return the new contact
                    return cl;
                })
            ))
        );
    }

    /**
* Create class
*/
    createClass(data) {
        return this.classes$.pipe(
            take(1),
            switchMap((classes) => this._httpClient.post<Class>('/api/admin/classes', data).pipe(
                map((newClass) => {

                    // Update class list with current page size
                    this._classes.next([newClass, ...classes].slice(0, this._pagination.value.pageSize));

                    return newClass;
                })
            ))
        )
    }

    /**
    * Update class
    */
    updateClass(id: string, data) {
        return this.classes$.pipe(
            take(1),
            switchMap((classes) => this._httpClient.put<Class>('/api/admin/classes/' + id, data).pipe(
                map((updatedClass) => {

                    // Find and replace updated class
                    const index = classes.findIndex(item => item.id === id);
                    classes[index] = updatedClass;
                    this._classes.next(classes);

                    // Update class
                    this._class.next(updatedClass);

                    return updatedClass;
                })
            ))
        )
    }

    deleteClass(id: string): Observable<boolean> {
        return this.classes$.pipe(
            take(1),
            switchMap(classes => this._httpClient.delete('/api/admin/classes/' + id).pipe(
                map((isDeleted: boolean) => {
                    // Find the index of the deleted product
                    const index = classes.findIndex(item => item.id === id);

                    // Delete the product
                    classes.splice(index, 1);

                    // Update the classes
                    this._classes.next(classes);

                    // Return the deleted status
                    return isDeleted;
                }),
            )),
        );
    }
}