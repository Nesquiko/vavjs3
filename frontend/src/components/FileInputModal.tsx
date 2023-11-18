// source https://blog.webdevsimplified.com/2023-04/html-dialog/

import { useEffect, useRef, useState } from 'react';

interface FileInputModalProps {
  open: boolean;
  onRead: (contents: string) => void;
  onClose: () => void;
  label: string;
}

export const FileInputModal = ({
  open,
  onRead,
  onClose,
  label,
}: FileInputModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [fileContents, setFileContents] = useState<string | undefined>(
    undefined,
  );

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
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files![0];
          const reader = new FileReader();
          reader.onload = (e) => {
            setFileContents(e.target!.result as string);
          };
          reader.readAsText(file);
        }}
      />
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          if (fileContents) {
            onRead(fileContents);
            closeDialog();
          }
        }}
      >
        {label}
      </button>
    </dialog>
  );
};
