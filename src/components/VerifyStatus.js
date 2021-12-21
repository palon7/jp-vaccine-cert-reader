export function VerifyStatus(props) {
  if (props.status) {
    return (
      <div className="alert alert-success" role="alert">
        <strong>検証OK</strong> 電子証明書の検証に成功しました
      </div>
    );
  } else {
    return (
      <div className="alert alert-danger" role="alert">
        <strong>検証エラー</strong>
        QRコードの読み取りエラーか改ざんされている可能性があります
      </div>
    );
  }
}
