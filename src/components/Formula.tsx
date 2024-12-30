import { useEffect, useState } from "react";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import SortableItem from "./SortableItem";
import GameSetting from "./GameSetting";
import { calcEnteredFormula, genNumList } from "../utils/global";
import Parentheses from "./Parentheses";

type Status = "right" | "wrong" | "error" | "";

export default function Formula() {
  // 個数の設定
  const [piece, setPiece] = useState(4);

  // 実際の数字の列
  const [numList, setNumList] = useState(genNumList(piece));

  // ゲームの状態
  const [[isRight, status], setIsRight] = useState<[string, Status]>(["", ""]);

  // スコアの状態
  const [score, setScore] = useState(0);
  const [scoreRate, setScoreRate] = useState(1);
  const [scoreRateChange, setScoreRateChange] = useState(1);

  const [currentFormula, setCurrentFormula] = useState("");

  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id === over?.id) return;
    const oldIndex = numList.findIndex(({ id }) => id === active.id);
    const newIndex = numList.findIndex(({ id }) => id === over?.id);

    setNumList((prevData) => arrayMove(prevData, oldIndex, newIndex));
  };

  const handleOperatorChange = (nextOperator: string, id: number) => {
    const updatedData = [...numList];
    const data = updatedData.find((item) => item.id === id)!;
    data.operator = nextOperator;
    setNumList(updatedData);
  };

  const operators = ["+", "-", "*", "/"];

  const judgeGame = () => {
    let formula = "";
    for (const item of numList.map(
      ({ num, operator, openParentheses, closeParentheses }) =>
        `${openParentheses && "("}${num}${closeParentheses && ")"}${operator}`
    )) {
      formula += item;
    }

    // 現在、formulaは"1+2+4+5+"のようになっているので、0か1を結合
    if (formula.endsWith("+") || formula.endsWith("-")) formula += 0;
    else formula += 1;

    setCurrentFormula(formula);
    try {
      const calcResult = calcEnteredFormula(formula);
      if (calcResult === 10) {
        setScoreRate((prevRate) => prevRate + scoreRateChange);
        setScore((prevScore) => prevScore + scoreRate);
        setIsRight(["成功です!", "right"]);
      } else {
        setIsRight([`失敗! その式は${calcResult}です。`, "wrong"]);
        setScoreRate(1);
      }
    } catch (err) {
      setIsRight(["式が成立していません。", "error"]);
      return err;
    }
  };

  useEffect(() => {
    setNumList(genNumList(piece));
    switch (piece) {
      case 4:
        setScoreRateChange(1);
        break;
      case 5:
        setScoreRateChange(2);
        break;
      case 6:
        setScoreRateChange(3);
        break;
      default:
        break;
    }
  }, [piece]);

  return (
    <main className='flex flex-col justify-center items-center'>
      <GameSetting piece={piece} setPiece={setPiece} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}>
        <SortableContext
          items={numList.map((item) => item.id)}
          strategy={verticalListSortingStrategy}>
          <section className='flex justify-center items-center py-10'>
            {numList.map((item, index) => (
              <div className='flex justify-center items-center' key={item.id}>
                <Parentheses
                  numList={numList}
                  setNumList={setNumList}
                  isOpen={true}
                  current={item.openParentheses}
                  id={item.id}
                />

                <SortableItem id={item.id}>
                  <span className='p-3 lg:text-xl md:text-lg'>{item.num}</span>
                </SortableItem>

                <Parentheses
                  id={item.id}
                  isOpen={false}
                  numList={numList}
                  setNumList={setNumList}
                  current={item.closeParentheses}
                />

                <SortableItem id={item.id}>
                  {index !== piece - 1 && (
                    <div>
                      <select
                        defaultValue={item.operator}
                        onChange={(e) => {
                          handleOperatorChange(e.target.value, item.id);
                        }}
                        className='md:p-1 lg:p-2 md:m-0 lg:m-2 bg-gray-100 rounded-sm'>
                        {operators.map((operator, index) => (
                          <option
                            value={operator}
                            key={index}
                            className='md:p-1 lg:p-2'>
                            {operator}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </SortableItem>
              </div>
            ))}
            <span className='md:text-lg lg:text-xl font-bold'>= 10</span>
          </section>
        </SortableContext>
      </DndContext>
      <button
        onClick={judgeGame}
        className='px-5 py-2 shadow m-1 active:shadow-none rounded-md bg-yellow-300 text-red-600 text-center'>
        Attack
      </button>
      {status !== "" && (
        <button
          onClick={() => {
            setNumList(genNumList(piece));
            if (status === "right") setIsRight(["", ""]);
          }}
          className='text-lg px-3 py-1 m-1 bg-lime-50 text-slate-800 rounded-sm border hover:border-2'>
          {status === "right" ? "NEXT" : "PASS"}
        </button>
      )}
      <div className='flex flex-col justify-center items-center'>
        <div
          className={`text-center text-xl font-bold p-2 m-1 ${
            status === "right" && "text-yellow-700 text-2xl"
          } ${status === "error" && "text-red-600"}`}>
          {isRight}
        </div>
        <div className='text-center font-medium p-2'>
          入力した式: {currentFormula}
        </div>
        <div className='text-lg'>現在のスコア: {score}</div>
      </div>
    </main>
  );
}
