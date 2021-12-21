import { ImmunationHistory } from "./ImmunationHistory";
import { PersonalInfo } from "./PersonalInfo";
import { VerifyStatus } from "./VerifyStatus";

export function ReadResults({ data, isLoading, isWaiting, isValid }) {
  if (isWaiting) {
    return (
      <div className="alert alert-info" role="alert">
        QRコードをかざしてください
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="alert alert-warning" role="alert">
        読み込み中……
      </div>
    );
  }

  if (!data) {
    return (
      <div className="alert alert-danger" role="alert">
        データの解析に失敗しました。正しいQRコードを使用していますか？
      </div>
    );
  }

  console.log(data);

  return (
    <div>
      <VerifyStatus status={isValid} />
      <h2>基本情報</h2>
      <PersonalInfo name={data.name} birthday={data.birthday} nbf={data.nbf} />

      <h2 className="mt-2">接種情報</h2>
      {data.immunizations.map((immunization, index) => (
        <ImmunationHistory
          key={index}
          number={index + 1}
          datetime={immunization.datetime}
          vaccineCode={immunization.vaccineCode}
          status={immunization.status}
          lotNumber={immunization.lotNumber}
          performer={immunization.performer}
        />
      ))}
    </div>
  );
}
