let pendingAction: (() => void) | null = null;

export const setPendingAuthAction = (action: () => void): void => {
  pendingAction = action;
};

export const runPendingAuthAction = (): void => {
  pendingAction?.();
  pendingAction = null;
};

export const clearPendingAuthAction = (): void => {
  pendingAction = null;
};
