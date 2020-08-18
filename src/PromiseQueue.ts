import { PromiseQueueItem, PromiseQueueItemStates } from "./PromiseQueueItem"

export class PromiseQueue {

  public haltOnError: boolean = true;

  public getState() {
    return this.items;
  }

  private items: PromiseQueueItem[] = [];

  private asyncFuncs: any[] = [
  ];

  private onTickFunction: (items: PromiseQueueItem[]) => any = null;
  public onTick = (callback: (items: PromiseQueueItem[]) => any) => {
    this.onTickFunction = callback;
  }



  public add = (title: string, func: () => Promise<any>) => {
    const item: PromiseQueueItem = {
      id: this.items.length,
      title,
      state: PromiseQueueItemStates.OPEN
    }
    this.items.push(item);

    this.asyncFuncs.push(() => {
      return new Promise((resolve, reject) => {
        func().then((message) => {
          item.message = message;
          item.finishDate = new Date();
          item.state = PromiseQueueItemStates.FINISHED;
          if (this.onTickFunction != null) {
            this.onTickFunction(this.items);
          }
          resolve()
        }).catch((message) => {
          item.message = message;
          item.state = PromiseQueueItemStates.ERROR;
          if (this.onTickFunction != null) {
            this.onTickFunction(this.items);
          }
          if (!this.haltOnError) {
            resolve()
          }
        })
      });
    })

  }

  public run: () => Promise<PromiseQueueItem[]> = () => {
    return new Promise((resolve, reject) => {
      const funcs = [...this.asyncFuncs, () => {
        resolve(this.items);
      }]
      funcs.reduce((prev, curr) => {
        return prev.catch((m: any) => { reject(m) }).then(curr);
      }, Promise.resolve())
    });
  }




}
