import { expect as expect } from 'chai';
import { PromiseQueue, PromiseQueueItem, PromiseQueueItemStates } from "../src"

let queue: PromiseQueue;

describe('With a PromiseQueue', () => {
  before(() => {
    queue = new PromiseQueue();
    queue.onTick((data: PromiseQueueItem[]) => {
      const count = data.filter((item: PromiseQueueItem) => { return item.state === PromiseQueueItemStates.FINISHED }).length;
      console.log("Tick " + count)
    });
  });
  it('should have no entries in state', () => {
    expect(queue.getState().length).to.be.equal(0);
  });

  describe('but when I add ten entries', () => {
    it('should have to entries', () => {
      queue.add("Entry1", () => { return new Promise(resolve => setTimeout(resolve, 100)); })
      queue.add("Entry2", () => { return new Promise(resolve => setTimeout(resolve, 800)); })
      queue.add("Entry3", () => { return new Promise(resolve => setTimeout(resolve, 1)); })
      queue.add("Entry4", () => { return new Promise(resolve => setTimeout(resolve, 10)); })
      queue.add("Entry5", () => { return new Promise(resolve => setTimeout(resolve, 500)); })
      queue.add("Entry6", () => { return new Promise(resolve => setTimeout(resolve, 1)); })
      queue.add("Entry7", () => { return new Promise(resolve => setTimeout(resolve, 10)); })
      queue.add("Entry8", () => { return new Promise(resolve => setTimeout(resolve, 10)); })
      queue.add("Entry9", () => { return new Promise(resolve => setTimeout(resolve, 10)); })
      queue.add("Entry10", () => { return new Promise(resolve => setTimeout(resolve, 10)); })
      expect(queue.getState().length).to.be.equal(10);
    });
    it('and if i let it run everything shoud be finished and in correct order', async () => {
      const data: PromiseQueueItem[] = await queue.run();

      expect(data[0].state).to.be.equal(PromiseQueueItemStates.FINISHED);
      expect(data[1].state).to.be.equal(PromiseQueueItemStates.FINISHED);
      expect(data[2].state).to.be.equal(PromiseQueueItemStates.FINISHED);
      expect(data[3].state).to.be.equal(PromiseQueueItemStates.FINISHED);
      expect(data[4].state).to.be.equal(PromiseQueueItemStates.FINISHED);
      expect(data[5].state).to.be.equal(PromiseQueueItemStates.FINISHED);
      expect(data[6].state).to.be.equal(PromiseQueueItemStates.FINISHED);
      expect(data[7].state).to.be.equal(PromiseQueueItemStates.FINISHED);
      expect(data[8].state).to.be.equal(PromiseQueueItemStates.FINISHED);
      expect(data[9].state).to.be.equal(PromiseQueueItemStates.FINISHED);


      expect(data[0].finishDate).to.be.lessThan(data[1].finishDate);
      expect(data[1].finishDate).to.be.lessThan(data[2].finishDate);
      expect(data[2].finishDate).to.be.lessThan(data[3].finishDate);
      expect(data[3].finishDate).to.be.lessThan(data[4].finishDate);
      expect(data[4].finishDate).to.be.lessThan(data[5].finishDate);
      expect(data[5].finishDate).to.be.lessThan(data[6].finishDate);
      expect(data[6].finishDate).to.be.lessThan(data[7].finishDate);
      expect(data[7].finishDate).to.be.lessThan(data[8].finishDate);
      expect(data[8].finishDate).to.be.lessThan(data[9].finishDate);

    });
  });
});




