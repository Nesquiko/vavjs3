import { useNavigate } from 'react-router-dom';
import { User } from '../model';
import { useState } from 'react';

interface HomePageProps {
  user: User;
}

export const HomePage = ({ user }: HomePageProps) => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigate();

  const handleLogout = async () => {
    await fetch(import.meta.env.VITE_BACKEND_URL + '/user/logout', {
      method: 'POST',
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          navigation('/login');
        } else {
          throw new Error('Failed to logout');
        }
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <div className="relative">
      <h1 className="text-black text-3xl">Home Page</h1>
      {errorMessage && (
        <p className="text-red-500 mb-4 text-center">{errorMessage}</p>
      )}
      <div className="absolute top-0 right-0">
        {user.name === 'admin' && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mr-4"
            onClick={() => navigation('/admin')}
          >
            Admin Dashboard
          </button>
        )}

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mr-4"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
