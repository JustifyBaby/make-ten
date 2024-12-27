const Header = () => {
  return (
    <header className='flex flex-col justify-center items-center'>
      <h1 className='text-2xl'>Make Ten</h1>
      <div className='m-2'>
        <h2>遊び方</h2>
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
      </div>
    </header>
  );
};

export default Header;
