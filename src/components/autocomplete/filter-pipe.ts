import { Pipe } from '@angular/core';

@Pipe({
    name: 'filter'
})
 export class FilterPipe {
    transform(items: Array<any>, value: string): any {
        const filteredArray = items.filter(item => item.name.startsWith(value));
        return filteredArray.length > 0 ? filteredArray : [];
    }
}
