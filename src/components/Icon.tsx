import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export const Icon = ({ name, size = 20, color = '#1D1424', style }: Props) => (
  <MaterialCommunityIcons name={name} size={size} color={color} style={style} />
);
