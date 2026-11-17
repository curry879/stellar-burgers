import { Navigate, useLocation } from 'react-router-dom';

import { useSelector } from '../../services/store';

import type { RootState } from '../../services/store';
import type { ReactNode } from 'react';

type TProtectedRouteProps = {
  children: ReactNode;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false,
}: TProtectedRouteProps): React.JSX.Element => {
  const location = useLocation();

  const { user, isAuthChecked } = useSelector((state: RootState) => state.user);

  if (!isAuthChecked) {
    return <p>Проверка авторизации...</p>;
  }

  if (onlyUnAuth && user) {
    const from = (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname;

    return <Navigate to={from ?? '/'} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
