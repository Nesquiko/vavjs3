import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegistrationRequest } from '../model';

export const RegistrationPage = () => {
  const navigation = useNavigate();
  const [registrationReq, setRegistrationReq] = useState<RegistrationRequest>({
    email: '',
    password: '',
    name: '',
    age: 0,
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegistration = async () => {
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleRegistration();
  };

  // inspired by https://flowbite.com/blocks/marketing/login/
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        className="bg-white border shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6">Registration</h2>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="text"
            placeholder="Email"
            value={registrationReq.email}
            onChange={(e) =>
              setRegistrationReq({
                ...registrationReq,
                email: e.target.value,
              })
            }
            autoComplete="email"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Name"
            value={registrationReq.name}
            onChange={(e) =>
              setRegistrationReq({ ...registrationReq, name: e.target.value })
            }
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Password"
            value={registrationReq.password}
            onChange={(e) =>
              setRegistrationReq({
                ...registrationReq,
                password: e.target.value,
              })
            }
            autoComplete="new-password"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="confirmPassword"
          >
            Re-enter Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="confirmPassword"
            type="password"
            placeholder="Re-enter Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="age"
          >
            Age
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="age"
            type="number"
            placeholder="Age"
            value={registrationReq.age}
            onChange={(e) =>
              setRegistrationReq({
                ...registrationReq,
                age: Number(e.target.value),
              })
            }
          />
        </div>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <div className="flex items-center justify-between">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};
