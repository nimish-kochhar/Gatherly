// TODO: Implement Modal component
export default function Modal({ children, isOpen, onClose }) {
  if (!isOpen) return null;
  return <div className="modal-overlay" onClick={onClose}><div className="modal-content">{children}</div></div>;
}
