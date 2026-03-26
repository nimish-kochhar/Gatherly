// TODO: Implement KarmaBadge
export default function KarmaBadge({ karma }) {
  return <span className="karma-badge">{karma || 0} karma</span>;
}
