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
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import sanitize from "sanitize-html";
import SortableItem from "./SortableItem";
import GameSetting from "./GameSetting";
import { genNumList } from "../utils/global";
import Parentheses from "./Parentheses";

export default function Formula() {
  const [piece, setPiece] = useState(4); // 個数の設定
  const [numList, setNumList] = useState(genNumList(piece)); // 実際の数字の列
  const [isRight, setIsRight] = useState("");
  const [score, setScore] = useState(0);
  const [scoreRate, setScoreRate] = useState(1);

  const calcEnteredFormula = (formula: string) => {
    const safetyCode = sanitize(formula);
    const value = eval(safetyCode);
    return value;
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const oldIndex = numList.findIndex(({ id }) => id === active.id);
      const newIndex = numList.findIndex(({ id }) => id === over?.id);

      setNumList((prevData) => arrayMove(prevData, oldIndex, newIndex));
    }
  };

  const handleOperatorChange = (nextOperator: string, id: number) => {
    const updatedData = [...numList];
    const data = updatedData.find((item) => item.id === id);
    data!.operator = nextOperator;
    setNumList(updatedData);
  };

  const operators = ["+", "-", "*", "/"];

  const judgeGame = () => {
    let formula = "";
    for (const item of numList.map(
      ({ num, operator, openParentheses, closeParentheses }) =>
        `${openParentheses ? "(" : ""}${num}${operator}${
          closeParentheses ? ")" : ""
        }`
    )) {
      formula += item;
    }
    console.log(formula);

    // 現在、formulaは"1+2+4+5+"のようになっているので、
    // 0か1を結合
    if (formula.endsWith("+") || formula.endsWith("-")) formula += 0;
    else formula += 1;

    const calcResult = calcEnteredFormula(formula);
    if (calcResult === 10) {
      setScoreRate(scoreRate + 1);
      setScore(score + scoreRate);
      setIsRight("成功です!");
    } else {
      setIsRight(`失敗! その式は${calcResult}です。`);
      setScoreRate(1);
    }
  };

  console.log(scoreRate, score);

  useEffect(() => {
    setNumList(genNumList(piece));
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
              <SortableItem key={item.id} id={item.id}>
                <div className='flex justify-between items-center rounded px-2'>
                  {index !== piece - 1 && (
                    <Parentheses
                      numList={numList}
                      setNumList={setNumList}
                      isOpen={true}
                      current={item.openParentheses}
                      id={item.id}
                    />
                  )}
                  <span className='md:p-1 lg:p-3 lg:text-xl md:text-lg'>
                    {item.num}
                  </span>
                  {index === piece - 1 ? (
                    <Parentheses
                      numList={numList}
                      setNumList={setNumList}
                      isOpen={false}
                      current={item.closeParentheses}
                      id={item.id}
                    />
                  ) : (
                    <div>
                      <select
                        defaultValue={item.operator}
                        onChange={(e) => {
                          handleOperatorChange(e.target.value, item.id);
                        }}
                        className='md:p-1 lg:p-2 md:m-1 lg:m-2 bg-gray-100 rounded-sm'>
                        {operators.map((operator, index) => (
                          <option
                            value={operator}
                            key={index}
                            className='md:p-1 lg:p-2'>
                            {operator}
                          </option>
                        ))}
                      </select>
                      <Parentheses
                        numList={numList}
                        setNumList={setNumList}
                        isOpen={false}
                        current={item.closeParentheses}
                        id={item.id}
                      />
                    </div>
                  )}
                </div>
              </SortableItem>
            ))}
            <span className='md:text-lg lg:text-xl font-bold'>= 10</span>
          </section>
        </SortableContext>
      </DndContext>
      <button
        onClick={judgeGame}
        className='px-5 py-2 shadow m-4 active:shadow-none rounded-md bg-yellow-300 text-red-600 text-center'>
        Attack
      </button>
      {isRight !== "" && (
        <button
          onClick={() => setNumList(genNumList(piece))}
          className='text-lg px-3 py-1 m-2 bg-lime-50 text-slate-800 rounded-sm border hover:border-2'>
          {isRight === "成功です!" ? "NEXT" : "PASS"}
        </button>
      )}
      <div className='flex flex-col justify-center items-center'>
        <div
          className={`text-center text-xl font-bold p-2 m-3 ${
            isRight === "成功です!" ? "text-red-600" : ""
          }`}>
          {isRight}
        </div>
        <div className='text-lg'>現在のスコア: {score}</div>
      </div>
    </main>
  );
}
