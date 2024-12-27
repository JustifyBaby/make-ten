class Random {
  static integer(min: number, max: number): number {
    return Math.floor(Math.random() * max + 1 - min) + min;
  }

  static choice<T>(array: T[]): T {
    return array[this.integer(0, array.length)];
  }

  static string(length: number) {
    const alphabets = [..."abcdefghijklmnopqrstuvwxyz"];
    const chars = [
      ...alphabets,
      ...alphabets.map((char) => char.toUpperCase()),
      ..."0123456789",
    ];

    let text: string = "";
    for (let i = 0; i < length; i++) {
      text += this.choice<string>(chars);
    }

    return text;
  }

  static shuffle<U>(prevList: U[]): U[] {
    // result container
    let afterList: U[] = [];

    while (prevList.length !== afterList.length) {
      const choose = this.choice<U>(prevList);
      if (afterList.includes(choose)) {
        // if include skip --> don't do anything, and go to head.
        continue;
      } else {
        // if passed add.
        afterList = [...afterList, choose];
      }
    }

    return afterList;
  }

  static pluralInts(min: number, max: number, piece: number) {
    let rands: number[] = [];
    for (let times = 0; times < piece; times++) {
      rands = [...rands, this.integer(min, max)];
    }
    return rands;
  }

  static pluralIntsNoRepeat(min: number, max: number, piece: number) {
    if (max - min < piece) {
      throw new Error("Value Error! max-min < piece => I must be repeat!!");
    }

    let rands: number[] = [];

    while (rands.length !== piece) {
      let rand = this.integer(min, max);
      if (rands.includes(rand)) {
        continue;
      } else {
        rands = [...rands, rand];
      }
    }
    return rands;
  }
}

export { Random };
