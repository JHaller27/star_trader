export interface IMomentable<M> {
    createSnapshot(): M;
    restore(momento: M): void;
}
