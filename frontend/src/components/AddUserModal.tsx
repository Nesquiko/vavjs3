import React, { useState } from 'react';
import { NewUserForm } from './NewUserForm';
import { RegistrationRequest } from '../model';
import { Modal } from './Modal';

interface AddUserModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}

export const AddUserModal = ({ open, setOpen, onClose }: AddUserModalProps) => {
  const [errorMessage, setErrorMessage] = useState('');

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
        setOpen(false);
      } else if (response.status === 409) {
        setErrorMessage('Email already exists');
      } else {
        setErrorMessage('Registration failed');
      }
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <NewUserForm
        handleRegistration={handleRegistration}
        errorMessage={errorMessage}
      />
    </Modal>
  );
};
