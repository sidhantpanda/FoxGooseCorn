export default class MinHeap<T> {
  private items: T[];
  private comparator: Comparator<T>;
  private minifier: Minifier<T>;
  private getKey: GetKey<T>;
  private posMap: { [key: string]: number } = {};

  /**
   * 
   * @param capacity Total capacity of the heap
   * @param comparator Comparator function. Return 1 if a > b, -1 if a < b, and 0 if a === b
   * @param minifier Returns the item by reducing distance to minimum possible
   * @param getKey Returns the identifying property of the item
   */
  constructor(comparator: Comparator<T>, minifier: Minifier<T>, getKey: GetKey<T>) {
    this.items = [];
    this.comparator = comparator;
    this.minifier = minifier;
    this.getKey = getKey;
  }

  private parent(i: number): number { return Math.floor((i - 1) / 2); }
  private left(i: number): number { return (2 * i + 1); }
  private right(i: number): number { return (2 * i + 2); }

  private minHeapify(i: number) {
    let l: number = this.left(i);
    let r: number = this.right(i);
    let smallest: number = i;

    if (l < this.items.length && this.comparator(this.items[l], this.items[i]) === -1) {
      smallest = l;
    }

    if (r < this.items.length && this.comparator(this.items[r], this.items[smallest]) === -1) {
      smallest = r;
    }

    if (smallest != i) {
      this.swap(i, smallest);
      this.minHeapify(smallest);
    }
  }

  private extractMin(): T {
    if (this.items.length === 0) {
      return null;
    }

    if (this.items.length === 1) {
      const result: T = this.items[0];
      this.posMap[this.getKey(result)] = null;
      this.items.pop();
      return result;
    }

    const root: T = this.items[0];
    this.items[0] = this.items[this.items.length - 1];
    this.posMap[this.getKey(this.items[0])] = 0;

    // Re order the position matrix
    this.items.splice(this.items.length - 1, 1);
    for (let key in this.posMap) {
      if (this.posMap.hasOwnProperty(key)) {
        if (key !== this.getKey(this.items[0])) {
          this.posMap[key]--;
        }
      }
    }

    this.minHeapify(0);
    return root;
  }
  public decreaseItem(key: string, newVal: T) {
    if (this.posMap[key] != null) {
      // console.log('decreasing', key, 'to', newVal)
      let i = this.posMap[key];
      this.items[i] = newVal;
      while (i != 0 && this.comparator(this.items[this.parent(i)], this.items[i]) === 1) {
        this.swap(i, this.parent(i));
        i = this.parent(i);
      }
    }
  }

  public getMin(): T {
    if (this.items.length > 0) {
      return this.items[0];
    }
    return null;
  }

  public deleteItem(key: string) {
    this.decreaseItem(key, this.minifier(this.items[this.posMap[key]]));
    this.extractMin();
  }

  public insertItem(item: T) {
    if (this.items.length === Number.MAX_VALUE) {
      console.log('Can\'t enter more items');
      return;
    }

    let i = this.items.length;
    this.items.push(item);
    this.posMap[this.getKey(item)] = i;
    while (i != 0 && this.comparator(this.items[this.parent(i)], this.items[i]) === 1) {
      this.swap(i, this.parent(i));
      i = this.parent(i);
    }
  }

  private swap(indexA: number, indexB: number) {
    let x: T = this.items[indexA];
    this.posMap[this.getKey(this.items[indexA])] = indexB;
    this.posMap[this.getKey(this.items[indexB])] = indexA;
    this.items[indexA] = this.items[indexB];
    this.items[indexB] = x;
  }

  public hasItems(): boolean {
    return this.items.length > 0;
  }
}

interface Comparator<T> {
  (a: T, b: T): number
}

interface Minifier<T> {
  (a: T): T
}

interface GetKey<T> {
  (a: T): string
}