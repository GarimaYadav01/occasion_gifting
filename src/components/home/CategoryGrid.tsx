import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { Category } from '../../types';
import { Icon } from '../ui/Icon';
import { colors, radius, spacing } from '../../theme';

const COLS = 4;
const GAP = 12;
const H_PAD = 20;
const ITEM_WIDTH =
  (Dimensions.get('window').width - H_PAD * 2 - GAP * (COLS - 1)) / COLS;

interface CategoryGridProps {
  categories: Category[];
  onPress: (category: Category) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  onPress,
}) => (
  <View style={styles.grid}>
    {categories.map(category => (
      <TouchableOpacity
        key={category.id}
        style={styles.item}
        activeOpacity={0.85}
        onPress={() => onPress(category)}>
        <View style={styles.iconWrap}>
          {category.imageUrl ? (
            <Image source={{ uri: category.imageUrl }} style={styles.catImage} />
          ) : (
            <Icon name={category.icon} size={26} color={colors.skyBlue} />
          )}
        </View>
        <Text style={styles.name} numberOfLines={2}>
          {category.name}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  item: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  catImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 14,
  },
});
