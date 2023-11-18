import { useNavigate } from 'react-router-dom';
import { User } from '../model';

interface HomePageProps {
  user: User;
}

export const HomePage = ({ user }: HomePageProps) => {
  const navigation = useNavigate();

  return (
    <div className="relative">
      <h1>Home Page</h1>
      {user.name === 'admin' && (
        <button
          className="absolute top-0 right-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mr-4"
          onClick={() => navigation('/admin')}
        >
          Admin Dashboard
        </button>
      )}
    </div>
  );
};
