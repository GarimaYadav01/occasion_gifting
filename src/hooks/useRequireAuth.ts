import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { openLoginModal } from '../store/slices/authSlice';
import {
  setPendingAuthAction,
  clearPendingAuthAction,
} from '../services/authGate';

export const useRequireAuth = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  const requireAuth = useCallback(
    (action: () => void, message = 'Login to continue') => {
      if (isAuthenticated) {
        action();
      } else {
        setPendingAuthAction(action);
        dispatch(openLoginModal(message));
      }
    },
    [isAuthenticated, dispatch],
  );

  const cancelAuth = useCallback(() => {
    clearPendingAuthAction();
  }, []);

  return { requireAuth, isAuthenticated, cancelAuth };
};
