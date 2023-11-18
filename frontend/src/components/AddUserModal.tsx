// source https://blog.webdevsimplified.com/2023-04/html-dialog/

import { useEffect, useRef, useState } from 'react';
import { NewUserForm } from './NewUserForm';
import { RegistrationRequest } from '../model';

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddUserModal = ({ open, onClose }: AddUserModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleRegistration = async (
    registrationReq: RegistrationRequest,
    confirmPassword: string,
  ) => {
    if (registrationReq.password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    await fetch(import.meta.env.VITE_BACKEND_URL + '/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationReq),
    }).then((response) => {
      if (response.ok) {
        closeDialog();
      } else if (response.status === 409) {
        setErrorMessage('Email already exists');
      } else {
        setErrorMessage('Registration failed');
      }
    });
  };

  return (
    <dialog
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
      <NewUserForm
        handleRegistration={handleRegistration}
        errorMessage={errorMessage}
      />
    </dialog>
  );
};
