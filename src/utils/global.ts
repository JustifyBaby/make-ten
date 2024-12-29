import sanitize from "sanitize-html";
import { Random } from "../utils/rand";
import { NumElement } from "../utils/types";

export const PIECE_RANGE = { min: 4, max: 6 };

const isValid = (values: number[], piece: number) => {
  const sum = values.reduce((a, b) => a + b);
  const product = values.reduce((a, b) => a * b);

  if (sum < 10 && product < 10)
    return isValid(Random.pluralInts(1, 9, piece), piece);
  else return values;
};

export const genNumList = (piece: number): NumElement[] => {
  const numVals = Random.pluralInts(1, 9, piece);
  return isValid(numVals, piece)!.map((num, id) => ({
    num,
    id,
    operator: "+",
    openParentheses: false,
    closeParentheses: false,
  }));
};

export const calcEnteredFormula = (formula: string) => {
  const safetyCode = sanitize(formula);
  const value = eval(safetyCode);
  return value;
};
