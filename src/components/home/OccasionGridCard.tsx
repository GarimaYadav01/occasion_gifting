import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Occasion } from '../../types';
import { formatPrice } from '../../data/mockData';
import { Icon } from '../ui/Icon';
import { colors, radius, spacing } from '../../theme';

const COLS = 2;
const GAP = 14;
const H_PAD = 20;
const CARD_WIDTH =
  (Dimensions.get('window').width - H_PAD * 2 - GAP) / COLS;

interface OccasionGridCardProps {
  occasion: Occasion;
  onPress: () => void;
}

export const OccasionGridCard: React.FC<OccasionGridCardProps> = ({
  occasion,
  onPress,
}) => (
  <TouchableOpacity
    style={styles.card}
    activeOpacity={0.9}
    onPress={onPress}>
    <Image
      source={{ uri: occasion.imageUrl }}
      style={styles.image}
      resizeMode="cover"
    />
    <View style={styles.overlay} />
    <View style={styles.content}>
      <View style={styles.iconWrap}>
        <Icon name={occasion.icon} size={18} color={colors.skyBlue} />
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {occasion.name}
      </Text>
      <Text style={styles.price}>From {formatPrice(occasion.startingPrice)}</Text>
    </View>
    <View style={styles.arrow}>
      <Icon name="chevron-right" size={20} color={colors.white} />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.15,
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: GAP,
    backgroundColor: colors.white,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 6,
  },
  image: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.md,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  price: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
  arrow: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
