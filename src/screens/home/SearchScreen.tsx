import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { giftCategories, products } from '../../data/mockData';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/layout/Header';
import { ProductCard } from '../../components/home/ProductCard';
import { Icon } from '../../components/ui/Icon';
import { Card } from '../../components/ui/Card';
import { colors, radius, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'Search'>;

export const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { requireAuth } = useRequireAuth();
  const [query, setQuery] = useState('');
  const wishlistIds = useAppSelector(state => state.wishlist.productIds);

  const trimmed = query.trim().toLowerCase();

  const matchedCategories = useMemo(() => {
    if (!trimmed) return giftCategories;
    return giftCategories.filter(
      c =>
        c.name.toLowerCase().includes(trimmed) ||
        c.description.toLowerCase().includes(trimmed),
    );
  }, [trimmed]);

  const matchedProducts = useMemo(() => {
    if (!trimmed) return products;
    return products.filter(
      p =>
        p.name.toLowerCase().includes(trimmed) ||
        p.description.toLowerCase().includes(trimmed) ||
        p.tags.some(t => t.toLowerCase().includes(trimmed)) ||
        p.category.toLowerCase().includes(trimmed),
    );
  }, [trimmed]);

  return (
    <ScreenContainer contentStyle={styles.content}>
      <Header
        title="Search"
        subtitle="Products & categories"
        showBack
        onBack={() => navigation.goBack()}
      />

      <View style={styles.searchRow}>
        <Icon name="magnify" size={20} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products or categories..."
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
          autoFocus
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {query.length > 0 ? (
          <TouchableOpacity onPress={() => setQuery('')} hitSlop={8}>
            <Icon name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      <Text style={styles.sectionTitle}>
        Categories
        {trimmed ? ` (${matchedCategories.length})` : ''}
      </Text>
      {matchedCategories.length === 0 ? (
        <Text style={styles.emptyText}>No categories match your search</Text>
      ) : (
        matchedCategories.map(category => (
          <TouchableOpacity
            key={category.id}
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate('ProductListing', {
                categoryId: category.id,
                title: category.name,
              })
            }>
            <Card style={styles.categoryRow}>
              <View style={styles.categoryIcon}>
                <Icon name={category.icon} size={22} color={colors.skyBlue} />
              </View>
              <View style={styles.categoryText}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryDesc} numberOfLines={1}>
                  {category.description}
                </Text>
              </View>
              <Icon name="chevron-right" size={20} color={colors.textMuted} />
            </Card>
          </TouchableOpacity>
        ))
      )}

      <Text style={[styles.sectionTitle, styles.productsTitle]}>
        Products
        {trimmed ? ` (${matchedProducts.length})` : ''}
      </Text>
      {matchedProducts.length === 0 ? (
        <Text style={styles.emptyText}>No products match your search</Text>
      ) : (
        <View style={styles.grid}>
          {matchedProducts.map(product => (
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
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.huge,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 0,
  },
  sectionTitle: {
    ...typography.label,
    marginBottom: spacing.md,
  },
  productsTitle: {
    marginTop: spacing.lg,
  },
  emptyText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingVertical: spacing.md,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.purpleLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  categoryText: {
    flex: 1,
  },
  categoryName: {
    ...typography.body,
    fontWeight: '600',
  },
  categoryDesc: {
    ...typography.caption,
    textTransform: 'none',
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
