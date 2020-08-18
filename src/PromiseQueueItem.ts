export interface PromiseQueueItem {
  id: number;
  title: string;
  state: PromiseQueueItemStates;
  finishDate?: Date,
  message?: string;
}

export enum PromiseQueueItemStates {
  OPEN = "OPEN",
  FINISHED = "FINISHED",
  ERROR = "ERROR",
}
