import { Dispatch, SetStateAction } from "react";
import { PIECE_RANGE } from "../utils/global";

export default function GameSetting({
  piece,
  setPiece,
}: {
  piece: number;
  setPiece: Dispatch<SetStateAction<number>>;
}) {
  const pieceSetter = (nextValue: number) => {
    if (PIECE_RANGE.min > nextValue) return;
    if (PIECE_RANGE.max < nextValue) return;

    setPiece(nextValue);
  };

  return (
    <div className='flex justify-center items-center p-2 m-3'>
      <button
        onClick={() => pieceSetter(piece - 1)}
        className='m-2 px-4 py-1 bg-blue-100 rounded-sm'>
        -
      </button>
      <div>項数: {piece}</div>
      <button
        onClick={() => pieceSetter(piece + 1)}
        className='m-2 px-4 py-1 bg-red-100 rounded-sm'>
        +
      </button>
    </div>
  );
}
