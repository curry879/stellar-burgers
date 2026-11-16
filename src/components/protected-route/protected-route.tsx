import type { ReactNode } from 'react';

type TProtectedRouteProps = {
  children: ReactNode;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false,
}: TProtectedRouteProps): React.JSX.Element => {
  // Проверку авторизации добавилю на шаге 2
  void onlyUnAuth;

  return <>{children}</>;
};
