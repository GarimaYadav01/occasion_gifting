import React from 'react';
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import RNLinearGradient from 'react-native-linear-gradient';

interface Props extends ViewProps {
  colors: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  locations?: number[];
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/**
 * Layout-safe gradient: a plain View owns layout/padding and children,
 * with the native gradient painted behind as an absolute fill.
 */
const LinearGradient = ({ colors, start, end, locations, style, children, ...rest }: Props) => (
  <View style={[styles.clip, style]} {...rest}>
    <RNLinearGradient pointerEvents="none" colors={colors} start={start} end={end} locations={locations} style={StyleSheet.absoluteFill} />
    {children}
  </View>
);

const styles = StyleSheet.create({ clip: { overflow: 'hidden' } });

export default LinearGradient;
