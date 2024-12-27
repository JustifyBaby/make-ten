import { Dispatch, SetStateAction } from "react";
import { NumElement } from "../utils/types";

const Parentheses = ({
  id,
  current,
  numList,
  setNumList,
  isOpen,
}: {
  id: number;
  current: boolean;
  numList: NumElement[];
  setNumList: Dispatch<SetStateAction<NumElement[]>>;
  isOpen: boolean;
}) => {
  // const handleParenthesesChange = (id: number, isOpen: boolean) => {z
  //   const updatedData = [...numList];
  //   const data = updatedData.find((item) => item.id === id);
  //   if (isOpen) data!.openParentheses = !data!.openParentheses;
  //   else data!.closeParentheses = !data!.closeParentheses;

  //   setNumList(updatedData);
  // };

  console.log(id, isOpen, current, numList, setNumList);
  return (
    <></>
    // <button
    //   className={`text-xl shadow p-2 ${current ? "bg-lime-400" : ""}`}
    //   onClick={() => handleParenthesesChange(id, isOpen)}>
    //   {isOpen ? "(" : ")"}
    // </button>
  );
};

export default Parentheses;
