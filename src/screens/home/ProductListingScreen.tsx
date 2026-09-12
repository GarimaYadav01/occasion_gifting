import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { getProductsByCategory, products } from '../../data/mockData';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/layout/Header';
import { ProductCard } from '../../components/home/ProductCard';
import { spacing } from '../../theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'ProductListing'>;

export const ProductListingScreen: React.FC<Props> = ({ navigation, route }) => {
  const { categoryId, title } = route.params;
  const dispatch = useAppDispatch();
  const { requireAuth } = useRequireAuth();
  const wishlistIds = useAppSelector(state => state.wishlist.productIds);

  const productList = useMemo(() => {
    if (title === 'All Gifts') return products;
    return getProductsByCategory(categoryId);
  }, [categoryId, title]);

  return (
    <ScreenContainer contentStyle={styles.content}>
      <Header
        title={title}
        subtitle={`${productList.length} items`}
        showBack
        onBack={() => navigation.goBack()}
      />
      <View style={styles.grid}>
        {productList.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            isWishlisted={wishlistIds.includes(product.id)}
            onPress={() =>
              navigation.navigate('ProductDetails', { productId: product.id })
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
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.huge,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
