import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { HomeStackParamList, MainTabParamList } from '../../navigation/types';
import {
  giftCategories,
  products,
  occasionChips,
} from '../../data/mockData';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { HomeHeader } from '../../components/home/HomeHeader';
import { BannerCarousel } from '../../components/home/BannerCarousel';
import { OccasionChips } from '../../components/home/OccasionChips';
import { CategoryGrid } from '../../components/home/CategoryGrid';
import { ProductRowCard } from '../../components/home/ProductRowCard';
import { ProductCard } from '../../components/home/ProductCard';
import { colors, spacing, typography } from '../../theme';
import { Icon } from '../../components/ui/Icon';

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'Home'>,
  BottomTabScreenProps<MainTabParamList>
>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { requireAuth } = useRequireAuth();
  const [search, setSearch] = useState('');
  const wishlistIds = useAppSelector(state => state.wishlist.productIds);
  const cartCount = useAppSelector(state =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0),
  );
  const unreadCount = useAppSelector(
    state => state.app.notifications.filter(n => !n.read).length,
  );

  const filteredProducts = search
    ? products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      )
    : products;

  const bestsellers = products.filter(p => p.tags.includes('Bestseller'));
  const sameDayProducts = products.filter(p => p.sameDayDelivery);

  return (
    <View style={styles.container}>
      <HomeHeader
        search={search}
        onSearchChange={setSearch}
        cartCount={cartCount}
        onCartPress={() => navigation.navigate('Cart')}
        onNotificationPress={() =>
          requireAuth(() => navigation.navigate('Notifications'), 'Login to view notifications')
        }
        unreadCount={unreadCount}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        <View style={styles.section}>
          <BannerCarousel />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Occasion</Text>
          <OccasionChips
            chips={occasionChips}
            onPress={() =>
              navigation.getParent()?.navigate('OccasionsTab')
            }
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <CategoryGrid
            categories={giftCategories}
            onPress={category =>
              navigation.navigate('ProductListing', {
                categoryId: category.id,
                title: category.name,
              })
            }
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bestsellers</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ProductListing', {
                  categoryId: 'flowers',
                  title: 'Bestsellers',
                })
              }>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rowScroll}>
            {bestsellers.map(product => (
              <ProductRowCard
                key={product.id}
                product={product}
                isWishlisted={wishlistIds.includes(product.id)}
                onPress={() =>
                  navigation.navigate('ProductDetails', {
                    productId: product.id,
                  })
                }
                onWishlistPress={() =>
                  requireAuth(
                    () => dispatch(toggleWishlist(product.id)),
                    'Login to save to wishlist',
                  )
                }
              />
            ))}
          </ScrollView>
        </View>

        <View style={[styles.section, styles.sameDaySection]}>
            <View style={styles.sameDayHeader}>
            <View style={styles.sameDayTitleRow}>
              <Icon name="flash" size={18} color={colors.green} />
              <Text style={styles.sameDayTitle}>Same Day Delivery</Text>
            </View>
            <Text style={styles.sameDaySub}>Delivered in 3-6 hours</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rowScroll}>
            {sameDayProducts.map(product => (
              <ProductRowCard
                key={product.id}
                product={product}
                isWishlisted={wishlistIds.includes(product.id)}
                onPress={() =>
                  navigation.navigate('ProductDetails', {
                    productId: product.id,
                  })
                }
                onWishlistPress={() =>
                  requireAuth(
                    () => dispatch(toggleWishlist(product.id)),
                    'Login to save to wishlist',
                  )
                }
              />
            ))}
          </ScrollView>
        </View>

        {search ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Search Results ({filteredProducts.length})
            </Text>
            <View style={styles.grid}>
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onPress={() =>
                    navigation.navigate('ProductDetails', {
                      productId: product.id,
                    })
                  }
                  onWishlistPress={() =>
                    requireAuth(
                      () => dispatch(toggleWishlist(product.id)),
                      'Login to save to wishlist',
                    )
                  }
                />
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Gifts</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ProductListing', {
                    categoryId: 'flowers',
                    title: 'All Gifts',
                  })
                }>
                <Text style={styles.seeAll}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.grid}>
              {products.slice(0, 4).map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onPress={() =>
                    navigation.navigate('ProductDetails', {
                      productId: product.id,
                    })
                  }
                  onWishlistPress={() =>
                    requireAuth(
                      () => dispatch(toggleWishlist(product.id)),
                      'Login to save to wishlist',
                    )
                  }
                />
              ))}
            </View>
          </View>
        )}

        <View style={styles.trustSection}>
          {[
            { icon: 'shield-check', label: '100% Safe Delivery' },
            { icon: 'flash', label: 'Same Day Available' },
            { icon: 'lock', label: 'Secure Payments' },
          ].map(item => (
            <View key={item.label} style={styles.trustItem}>
              <Icon name={item.icon} size={22} color={colors.skyBlue} />
              <Text style={styles.trustLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scroll: {
    paddingBottom: spacing.huge,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.skyBlue,
    marginBottom: spacing.md,
  },
  rowScroll: {
    paddingRight: spacing.lg,
  },
  sameDaySection: {
    backgroundColor: colors.greenLight,
    marginHorizontal: spacing.lg,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  sameDayHeader: {
    marginBottom: spacing.md,
  },
  sameDayTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sameDayTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.green,
  },
  sameDaySub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  trustSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: 16,
    marginBottom: spacing.lg,
  },
  trustItem: {
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  trustLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
