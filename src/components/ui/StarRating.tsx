import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from './Icon';
import { colors } from '../../theme';

interface StarRatingProps {
  rating: number;
  size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, size = 14 }) => (
  <View style={styles.row}>
    {[1, 2, 3, 4, 5].map(star => (
      <Icon
        key={star}
        name={star <= Math.round(rating) ? 'star' : 'star-outline'}
        size={size}
        color={colors.warning}
        style={styles.star}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 1,
  },
});
