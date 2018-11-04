/**Basic priority queue implementation */
export class PriorityQueue<T> {
    elements: PriorityQueueEntry<T>[] = [];

    /**Adds a new element to a position in the queue, based on its priority in order */
    enqueue(value: T, priority: number): void {
        const queueEntry = new PriorityQueueEntry(value, priority);

        // This is the first element in the array
        if (!this.elements.length) {
            this.elements.push(queueEntry);
            return;
        }

        // This element has the highest priority
        if (this.elements[0].priority < priority) {
            this.elements.unshift(queueEntry);
            return;
        }

        // This element has the lowest priority
        if (this.elements[this.elements.length - 1].priority > priority) {
            this.elements.push(queueEntry);
            return;
        }

        // TODO: verify that indices are correct and produce expected results
        // This element priority is somewhere in the middle
        const indexToInsertAt = this.getIndexToInsertAt(priority);
        const leftSide = this.elements.slice(0, indexToInsertAt);
        const rightSide = this.elements.slice(indexToInsertAt, this.elements.length);

        this.elements = [].concat(leftSide, [queueEntry], rightSide);
    }

    /**Returns the first element in the queue, based on its priority (highest priority first) */
    dequeue(): T {
        return this.elements.shift().element;
    }

    clear(): void {
        this.elements = [];
    }

    /**Returns true if this queue is empty, false otherwise */
    get empty(): boolean {
        return this.elements.length === 0;
    }

    /**Returns the index to insert after
     * Currently implemented using basic and slow bubble-sort-like algorithm
     */
    private getIndexToInsertAt(priority: number): number {
        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i].priority < priority) {
                return i;
            }
        }
    }
}

class PriorityQueueEntry<T> {
    element: T;
    priority: number;

    constructor(element: T, priority: number) {
        this.element = element;
        this.priority = priority;
    }
}
