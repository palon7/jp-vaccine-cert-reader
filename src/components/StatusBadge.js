export function StatusBadge(props) {
  switch (props.status) {
    case "completed":
      return <span className="badge bg-success">完了</span>;
    case "entered-in-error":
      return <span className="badge bg-danger">誤入力</span>;
    case "not-done":
      return <span className="badge bg-danger">未完了</span>;
    default:
      return <span className="badge bg-secondary">不明</span>;
  }
}
