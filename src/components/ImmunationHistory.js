import { StatusBadge } from "./StatusBadge";

const VACCINE_CODE = {
  212: "ジョンソン・エンド・ジョンソン",
  207: "モデルナ",
  208: "ファイザー", // 30 mcg/0.3 mL ages 12+
  217: "ファイザー", // 30 mcg/0.3 mL for ages 12+
  218: "ファイザー", // 10 mcg/0.2 mL for ages 5 yrs to < 12 yrs
  219: "ファイザー", //  3 mcg/0.2 mL for ages 2 yrs to < 5 yrs
  210: "アストラゼネカ",
  211: "Novavax",
};

function getVaccineName(code) {
  if (code in VACCINE_CODE) {
    return VACCINE_CODE[code];
  } else {
    return `不明 (ワクチンコード: ${code})`;
  }
}

export function ImmunationHistory({
  number,
  datetime,
  vaccineCode,
  status,
  lotNumber,
  performer,
}) {
  return (
    <div className="card mb-2">
      <div className="card-header">{number}回目</div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <strong>接種日</strong> {datetime}
        </li>
        <li className="list-group-item">
          <strong>メーカー</strong> {getVaccineName(vaccineCode)}
        </li>
        <li className="list-group-item">
          <strong>ロット番号</strong> {lotNumber}
        </li>
        <li className="list-group-item">
          <strong>ステータス</strong> <StatusBadge status={status} />
        </li>
      </ul>
    </div>
  );
}
