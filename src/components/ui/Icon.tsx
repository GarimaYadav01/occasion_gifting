import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme';

export type IconName = string;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 22,
  color = colors.text,
  style,
}) => (
  <MaterialCommunityIcons name={name} size={size} color={color} style={style} />
);

export const categoryIcons: Record<string, IconName> = {
  flowers: 'flower-tulip',
  cakes: 'cake-variant',
  hampers: 'gift-outline',
  personalized: 'draw-pen',
  chocolates: 'cookie',
  surprise: 'party-popper',
};

export const occasionIcons: Record<string, IconName> = {
  birthday: 'cake-variant',
  anniversary: 'heart',
  wedding: 'rings',
  'baby-shower': 'baby-carriage',
  engagement: 'flower-tulip',
  corporate: 'office-building',
};

export const serviceIcons: Record<string, IconName> = {
  decoration: 'balloon',
  catering: 'silverware-fork-knife',
  photography: 'camera',
  videography: 'video',
  makeup: 'face-woman-shimmer',
  dj: 'disc-player',
  'live-singer': 'microphone',
  venue: 'domain',
  'sound-lighting': 'spotlight-beam',
  'return-gifts': 'gift',
};
