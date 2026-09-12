import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getProductById } from '../../data/mockData';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { openLoginModal } from '../../store/slices/authSlice';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/layout/Header';
import { EmptyState } from '../../components/ui/EmptyState';
import { ProductCard } from '../../components/home/ProductCard';
import { HomeStackParamList } from '../../navigation/types';
import { spacing } from '../../theme';

export const WishlistScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useRequireAuth();
  const wishlistIds = useAppSelector(state => state.wishlist.productIds);
  const products = wishlistIds
    .map(id => getProductById(id))
    .filter(Boolean) as NonNullable<ReturnType<typeof getProductById>>[];

  if (!isAuthenticated) {
    return (
      <ScreenContainer scroll={false}>
        <Header title="Wishlist" subtitle="Saved for later" />
        <EmptyState
          icon="heart-outline"
          title="Login to View Wishlist"
          message="Sign in to save and view your favourite gifts."
          actionLabel="Login / Sign Up"
          onAction={() => dispatch(openLoginModal('Login to view your wishlist'))}
        />
      </ScreenContainer>
    );
  }

  if (products.length === 0) {
    return (
      <ScreenContainer scroll={false}>
        <Header title="Wishlist" subtitle="Saved for later" />
        <EmptyState
          icon="heart-outline"
          title="Wishlist is Empty"
          message="Tap the heart on any gift to save it here."
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer contentStyle={styles.content}>
      <Header
        title="Wishlist"
        subtitle={`${products.length} saved items`}
      />
      <View style={styles.grid}>
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            isWishlisted
            onPress={() =>
              navigation.getParent()?.navigate('HomeTab', {
                screen: 'ProductDetails',
                params: { productId: product.id },
              })
            }
            onWishlistPress={() => dispatch(toggleWishlist(product.id))}
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
