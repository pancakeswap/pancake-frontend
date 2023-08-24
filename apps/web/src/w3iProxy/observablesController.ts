import type { EventEmitter } from 'events'
import type { NextObserver, Observable } from 'rxjs'
import { take } from 'rxjs'
import { fromEvent } from 'rxjs'

export class ObservablesController<Events> {
  private readonly observables: Map<keyof Events, Observable<Events[keyof Events]>>
  private readonly emitter: EventEmitter

  public constructor(emitter: EventEmitter) {
    this.emitter = emitter
    this.observables = new Map()
    this.observe = this.observe.bind(this)
    this.observeOne = this.observeOne.bind(this)
  }

  private getObservable<K extends string & keyof Events>(eventName: K) {
    const observableExists = this.observables.has(eventName)
    if (!observableExists) {
      this.observables.set(eventName, fromEvent(this.emitter, eventName) as Observable<Events[K]>)
    }

    return this.observables.get(eventName) as Observable<Events[K]>
  }

  public observe<K extends string & keyof Events>(eventName: K, observer: NextObserver<Events[K]>) {
    const eventObservable = this.getObservable(eventName)

    const subscription = eventObservable.subscribe(observer)

    return subscription
  }

  public observeOne<K extends string & keyof Events>(
    eventName: K,
    observer: NextObserver<Events[K]>
  ) {
    const eventObservable = this.getObservable(eventName)

    const subscription = eventObservable.pipe(take(1)).subscribe({
      next: observer.next,
      error: observer.error,
      complete: () => {
        observer.complete?.()
        subscription.unsubscribe()
      }
    })
  }
}
