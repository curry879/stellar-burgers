import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { fetchProfileOrders } from '../../services/profileOrdersSlice';
import { useDispatch, useSelector } from '../../services/store';

import type { RootState } from '../../services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const orders = useSelector((state: RootState) => state.profileOrders.orders);

  useEffect(() => {
    void dispatch(fetchProfileOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
