// source https://www.robinwieruch.de/react-router-private-routes/

import { Navigate } from 'react-router-dom';
import { User } from '../model';

interface ProtectedRouteProps {
  user?: User;
  children: React.ReactNode;
}

export const ProtectedRoute = ({ user, children }: ProtectedRouteProps) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
