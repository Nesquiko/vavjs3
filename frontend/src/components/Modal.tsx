// source https://blog.webdevsimplified.com/2023-04/html-dialog/

import { useEffect, useRef } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ open, onClose, children }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const closeDialog = () => {
    dialogRef.current!.close();
    onClose();
  };

  useEffect(() => {
    if (dialogRef.current === null) {
      return;
    }

    if (open) {
      dialogRef.current!.showModal();
    } else {
      closeDialog();
    }
  }, [open]);

  return (
    <dialog
      className="p-4"
      ref={dialogRef}
      onClick={(e) => {
        const dialogDimensions = dialogRef.current!.getBoundingClientRect();
        if (
          e.clientX < dialogDimensions.left ||
          e.clientX > dialogDimensions.right ||
          e.clientY < dialogDimensions.top ||
          e.clientY > dialogDimensions.bottom
        ) {
          closeDialog();
        }
      }}
    >
      {children}
    </dialog>
  );
};
