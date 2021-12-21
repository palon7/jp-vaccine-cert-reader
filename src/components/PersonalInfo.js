export function PersonalInfo({ name, birthday, nbf }) {
  const nbfDate = new Date(nbf * 1000);
  const nbfString =
    nbfDate.toLocaleDateString(nbfDate) +
    " " +
    nbfDate.toLocaleTimeString(nbfDate);

  return (
    <div className="card">
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <strong>名前</strong> {name}
        </li>
        <li className="list-group-item">
          <strong>生年月日</strong> {birthday}
        </li>
        <li className="list-group-item">
          <strong>証明書発行日</strong> {nbfString}
        </li>
      </ul>
    </div>
  );
}
