// source https://www.robinwieruch.de/react-router-private-routes/

import { Navigate } from 'react-router-dom';
import { User } from '../model';

interface ProtectedRouteProps {
  user?: User;
  children: React.ReactNode;
  checkAdmin: boolean;
}

export const ProtectedRoute = ({
  user,
  children,
  checkAdmin,
}: ProtectedRouteProps) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (checkAdmin && user.name !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  return children;
};
