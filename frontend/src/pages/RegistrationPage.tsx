import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegistrationRequest } from '../model';
import { NewUserForm } from '../components/NewUserForm';

export const RegistrationPage = () => {
  const navigation = useNavigate();
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
        navigation('/', { replace: true });
      } else if (response.status === 409) {
        setErrorMessage('Email already exists');
      } else {
        setErrorMessage('Registration failed');
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <NewUserForm
        handleRegistration={handleRegistration}
        errorMessage={errorMessage}
      />
    </div>
  );
};
