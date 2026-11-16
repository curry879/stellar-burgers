import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import {
  fetchOrderByNumber,
  selectCurrentOrder,
  selectFeedOrders,
} from '../../services/feedSlice';
import { selectIngredients } from '../../services/ingredientsSlice';
import { useDispatch, useSelector } from '../../services/store';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const ingredients = useSelector(selectIngredients);
  const orders = useSelector(selectFeedOrders);
  const currentOrder = useSelector(selectCurrentOrder);

  const orderNumber = Number(number);

  const orderFromFeed = orders.find((order) => order.number === orderNumber);

  const orderData =
    orderFromFeed ?? (currentOrder?.number === orderNumber ? currentOrder : null);

  useEffect(() => {
    if (
      number !== undefined &&
      Number.isInteger(orderNumber) &&
      orderNumber > 0 &&
      !orderData
    ) {
      void dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, number, orderNumber, orderData]);

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

  if (!Number.isInteger(orderNumber) || orderNumber <= 0) {
    return <p>Некорректный номер заказа</p>;
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
