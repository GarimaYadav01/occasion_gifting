import React, { useRef } from 'react';
import { Animated, ImageStyle, StyleProp, View, ViewStyle, StyleSheet } from 'react-native';

interface Props {
  uri: string;
  style?: StyleProp<ViewStyle & ImageStyle>;
  children?: React.ReactNode;
}

/** Network image with a soft placeholder and fade-in. */
export const Img = ({ uri, style, children }: Props) => {
  const o = useRef(new Animated.Value(0)).current;
  return (
    <View style={[styles.wrap, style as StyleProp<ViewStyle>]}>
      <Animated.Image
        source={{ uri }}
        onLoad={() => Animated.timing(o, { toValue: 1, duration: 260, useNativeDriver: true }).start()}
        style={[StyleSheet.absoluteFill, { opacity: o }]}
        resizeMode="cover"
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({ wrap: { backgroundColor: '#F1E9EF', overflow: 'hidden' } });
