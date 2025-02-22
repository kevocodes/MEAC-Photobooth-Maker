export const getNextMultiple = (value: number, multipleOf: number): number => {
  const remainder = value % multipleOf;
  if (remainder === 0) {
    return value;
  }

  return value + multipleOf - remainder;
};
