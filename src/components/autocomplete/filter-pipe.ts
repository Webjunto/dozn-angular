import { Pipe } from '@angular/core';
import { DoznIonic } from '../../models/models';

@Pipe({
    name: 'filter'
})
 export class FilterPipe {
    transform(items: Array<DoznIonic.ItemOption>, value: string): any {
        const filteredArray = items.filter(item => item.name.startsWith(value));
        return filteredArray.length > 0 ? filteredArray : [];
    }
}
