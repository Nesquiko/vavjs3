import { useState } from 'react';
import { RegistrationRequest } from '../model';

interface NewUserFormProps {
  handleRegistration: (
    user: RegistrationRequest,
    confirmPassword: string,
  ) => void;
  errorMessage?: string;
}

export const NewUserForm = ({
  handleRegistration,
  errorMessage,
}: NewUserFormProps) => {
  const [registrationReq, setRegistrationReq] = useState<RegistrationRequest>({
    email: '',
    password: '',
    name: '',
    age: 20,
  });
  const [confirmPassword, setConfirmPassword] = useState('');

  // inspired by https://flowbite.com/blocks/marketing/login/
  return (
    <form
      className="bg-white rounded px-8 pt-6 pb-8 mb-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleRegistration(registrationReq, confirmPassword);
      }}
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
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
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
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
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
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
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
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
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
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
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
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Register
        </button>
      </div>
    </form>
  );
};
