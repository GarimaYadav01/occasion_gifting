import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
} from 'react-native';
import { promoBanners } from '../../data/mockData';
import { Icon } from '../ui/Icon';
import { colors, radius, spacing } from '../../theme';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 40;

interface BannerCarouselProps {
  onBannerPress?: (id: string) => void;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({
  onBannerPress,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / BANNER_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={BANNER_WIDTH}>
        {promoBanners.map(banner => (
          <TouchableOpacity
            key={banner.id}
            activeOpacity={0.95}
            onPress={() => onBannerPress?.(banner.id)}
            style={[styles.banner, { width: BANNER_WIDTH }]}>
            <View style={styles.bannerContent}>
              <View style={styles.bannerText}>
                <Text style={styles.bannerTitle}>{banner.title}</Text>
                <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                <View style={styles.shopNow}>
                  <Text style={styles.shopNowText}>Shop Now</Text>
                  <Icon name="chevron-right" size={14} color={colors.skyBlue} />
                </View>
              </View>
              <View style={styles.iconCircle}>
                <Icon name={banner.icon} size={32} color={colors.white} />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {promoBanners.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, activeIndex === i && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.lg },
  banner: {
    height: 148,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.skyBlue,
  },
  bannerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.skyBlue,
  },
  bannerText: { flex: 1 },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: spacing.md,
  },
  shopNow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
    gap: 4,
  },
  shopNowText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.skyBlue,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 18,
    backgroundColor: colors.skyBlue,
  },
});
