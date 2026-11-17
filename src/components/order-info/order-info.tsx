import { OrderInfoUI, Preloader } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import {
  fetchOrderByNumber,
  selectCurrentOrder,
  selectFeedOrders,
  selectOrderError,
  selectOrderLoading,
  selectRequestedOrderNumber,
} from '../../services/feedSlice';
import { selectIngredients } from '../../services/ingredientsSlice';
import { selectProfileOrders } from '../../services/profileOrdersSlice';
import { useDispatch, useSelector } from '../../services/store';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const ingredients = useSelector(selectIngredients);
  const orders = useSelector(selectFeedOrders);
  const profileOrders = useSelector(selectProfileOrders);
  const currentOrder = useSelector(selectCurrentOrder);
  const isOrderLoading = useSelector(selectOrderLoading);
  const orderError = useSelector(selectOrderError);
  const requestedOrderNumber = useSelector(selectRequestedOrderNumber);

  const orderNumber = Number(number);
  const isValidNumber =
    number !== undefined && Number.isSafeInteger(orderNumber) && orderNumber > 0;

  const orderFromFeed = orders.find((order) => order.number === orderNumber);

  const orderFromProfile = profileOrders.find((order) => order.number === orderNumber);

  const orderData =
    orderFromFeed ??
    orderFromProfile ??
    (currentOrder?.number === orderNumber ? currentOrder : null);

  useEffect(() => {
    if (isValidNumber && !orderData && requestedOrderNumber !== orderNumber) {
      void dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, isValidNumber, orderNumber, orderData, requestedOrderNumber]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) {
      return null;
    }

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);

          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (!isValidNumber) {
    return <p className="text text_type_main-medium">Некорректный номер заказа</p>;
  }

  if (orderInfo) {
    return <OrderInfoUI orderInfo={orderInfo} />;
  }

  if (requestedOrderNumber === orderNumber && !isOrderLoading) {
    return (
      <p className="text text_type_main-medium">{orderError ?? 'Заказ не найден'}</p>
    );
  }

  return <Preloader />;
};
