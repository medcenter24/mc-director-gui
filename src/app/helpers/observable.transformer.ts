import {Observable} from 'rxjs';

export class ObservableTransformer {

  transform(
    obsSrc: Observable<any>,
    nextSrc: Function,
    errorSrc: Function = () => {},
  ): Observable<any> {
    return new Observable<any>(subscriber => {
      obsSrc.subscribe({
        next: res => {
          subscriber.next(nextSrc(res));
          // subscriber.complete();
        },
        error: e => {
          errorSrc(e);
          subscriber.error(e);
        },
      });
    });
  }
}
