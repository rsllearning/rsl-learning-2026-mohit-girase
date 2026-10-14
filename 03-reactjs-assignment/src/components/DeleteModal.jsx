import Button from './Button';

function DeleteModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete this completed task?</p>
        <div className="modal-actions">
          <Button variant="silver" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
