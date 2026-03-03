/**
 * Generic Observer interface.
 * T represents the data payload the observer receives on update.
 */
export interface Observer<T> {
    update(data: T): void;
}

/**
 * Generic Subject interface.
 * T represents the data payload the subject broadcasts.
 */
export interface Subject<T> {
    attach(observer: Observer<T>): void;
    detach(observer: Observer<T>): void;
    notify(): void;
}
