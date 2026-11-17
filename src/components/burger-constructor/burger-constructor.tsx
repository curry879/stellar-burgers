import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { clearConstructor } from '../../services/constructorSlice';
import { clearOrder, createOrder } from '../../services/orderSlice';
import { useDispatch, useSelector } from '../../services/store';

import type { RootState } from '../../services/store';
import type { TConstructorIngredient, TConstructorState, TOrder } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state: RootState) => state.user.user);

  const constructorItems = useSelector(
    (state: RootState): TConstructorState => state.burgerConstructor
  );

  const orderRequest = useSelector(
    (state: RootState): boolean => state.order.orderRequest
  );

  const orderModalData = useSelector(
    (state: RootState): TOrder | null => state.order.orderModalData
  );

  const onOrderClick = async (): Promise<void> => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      void navigate('/login', { state: { from: location } });
      return;
    }

    const ingredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id,
    ];

    try {
      await dispatch(createOrder(ingredients)).unwrap();
      dispatch(clearConstructor());
    } catch (error) {
      console.error('Ошибка оформления заказа:', error);
    }
  };

  const closeOrderModal = (): void => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={() => {
        void onOrderClick();
      }}
      closeOrderModal={closeOrderModal}
    />
  );
};
