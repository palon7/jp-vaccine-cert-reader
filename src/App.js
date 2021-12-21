import { useSHCDecode } from "./module/UseSHCDecode";
import QrReader from "react-qr-reader";
import { ReadResults } from "./components/ReadResults";

function App() {
  const { setQrcodeText, decodedData, isWaiting, isLoading, isValid } =
    useSHCDecode();

  const handleQR = (data) => {
    if (data !== null) {
      setQrcodeText(data);
    }
  };
  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div className="container mt-4">
      <h1>接種証明書リーダー</h1>
      <p>厚生労働省の発行した新型コロナワクチン接種証明書を読み取ります。</p>
      <strong>開発中のアルファ版です。利用には注意してください</strong>
      <ul>
        <li>
          ブラウザ上ですべての処理を行うため、外部にカメラ映像や読み取ったデータを送信することはありません。
        </li>
        <li>制作者は本アプリの認識結果を保証しません。</li>
        <li>
          本アプリやその認識結果を利用したことによる損害について、制作者は一切の責任を負いません。
        </li>
        <li>
          接種証明書で確認できるのは、あくまでその接種証明書が改ざんされていないことに限られます。証明書を提示した者が本人であるかは別途確認する必要があります。
        </li>
      </ul>
      <div className="row">
        <div className="col-lg-5">
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleQR}
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-lg-7">
          <ReadResults
            isWaiting={isWaiting}
            isLoading={isLoading}
            isValid={isValid}
            data={decodedData}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
