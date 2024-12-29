import { useState } from "react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className='flex flex-col justify-center items-center'>
      <h1 className='text-2xl m-2 p-2'>Make Ten</h1>
      <div className='m-2'>
        <div className='flex justify-center items-center'>
          <h2 className='text-lg m-2'>遊び方</h2>
          <button
            className='bg-slate-100 px-2 mx-1 rounded-md'
            onClick={() => setIsOpen((prev) => !prev)}>
            {isOpen ? "閉じる" : "開く"}
          </button>
        </div>
        {isOpen && (
          <ol>
            <li>項の数を設定します。</li>
            <li>下記の式が成り立つように設定します。</li>
            <p>ドラッグアンドドロップで式を入れ替えることができます</p>
            <p>少し暗いところを押して、演算子を調整します。</p>
            <p>かっこは使えないので、項入れ替えで対応してください</p>
            <li>Attackを押します</li>
            <li>
              <p>成功したらNEXTを押します。</p>
              <p>失敗したらPASSを押すか、やり直します</p>
            </li>
          </ol>
        )}
      </div>
    </header>
  );
};

export default Header;
