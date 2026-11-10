import React, { useRef } from 'react';
import { Animated, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  scale?: number;
  children?: React.ReactNode;
}

/** Pressable with a subtle spring "squish" — used for every tappable surface. */
export const Tap = ({ style, scale = 0.96, children, onPressIn, onPressOut, disabled, ...rest }: Props) => {
  const v = useRef(new Animated.Value(1)).current;
  const to = (n: number) => Animated.spring(v, { toValue: n, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      onPressIn={e => { to(scale); onPressIn?.(e); }}
      onPressOut={e => { to(1); onPressOut?.(e); }}
      hitSlop={6}
      style={[style, { transform: [{ scale: v }] }, disabled ? { opacity: 0.5 } : null]}>
      {children}
    </AnimatedPressable>
  );
};
