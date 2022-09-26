export function uniqueRandom(minimum: number, maximum: number) {
  let previousValue: number;

  return function random() {
    const number = Math.floor(
      Math.random() * (maximum - minimum + 1) + minimum,
    );

    previousValue =
      number === previousValue && minimum !== maximum ? random() : number;

    return previousValue;
  };
}

export function uniqueRandomArray<T>(array: T[]) {
  const random = uniqueRandom(0, array.length - 1);
  return () => array[random()];
}
