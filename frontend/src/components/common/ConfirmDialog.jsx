import Modal from './Modal';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="mt-2">
        <p className="text-sm text-gray-500">{message}</p>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className="btn-secondary">Cancel</button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="btn-primary bg-red-600 hover:bg-red-700"
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
