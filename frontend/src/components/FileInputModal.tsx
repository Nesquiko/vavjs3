import { useState } from 'react';
import { Modal } from './Modal';

interface FileInputModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onRead: (contents: string) => void;
  onClose: () => void;
  label: string;
}

export const FileInputModal = ({
  open,
  setOpen,
  onRead,
  onClose,
  label,
}: FileInputModalProps) => {
  const [fileContents, setFileContents] = useState<string | undefined>(
    undefined,
  );

  return (
    <Modal open={open} onClose={onClose}>
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
            setOpen(false);
          }
        }}
      >
        {label}
      </button>
    </Modal>
  );
};
