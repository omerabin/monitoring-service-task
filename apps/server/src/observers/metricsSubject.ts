import { Observer, Subject } from '../interfaces/observer';
import { ServiceMetrics } from '../interfaces/serviceMetrics';

/**
 * createMetricsSubject — creates a Subject<ServiceMetrics> using a closure.
 *
 * Holds a Set of observers and the latest data snapshot.
 * notify() calls update(data) on every attached observer.
 */
export const createMetricsSubject = (): Subject<ServiceMetrics> & { setData(data: ServiceMetrics): void } => {
    const observers = new Set<Observer<ServiceMetrics>>();
    let latestData: ServiceMetrics | undefined;

    return {
        attach: (observer: Observer<ServiceMetrics>): void => {
            observers.add(observer);
        },

        detach: (observer: Observer<ServiceMetrics>): void => {
            observers.delete(observer);
        },

        setData: (data: ServiceMetrics): void => {
            latestData = data;
        },

        notify: (): void => {
            if (latestData === undefined) return;
            observers.forEach(o => o.update(latestData!));
        },
    };
};
