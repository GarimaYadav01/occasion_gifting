import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { getProductById, formatPrice } from '../../data/mockData';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { Icon } from '../../components/ui/Icon';
import { GradientButton } from '../../components/ui/GradientButton';
import { StarRating } from '../../components/ui/StarRating';
import { Badge } from '../../components/ui/Badge';
import { colors, radius, spacing, typography } from '../../theme';

const { width, height } = Dimensions.get('window');

type Props = NativeStackScreenProps<HomeStackParamList, 'ProductDetails'>;

export const ProductDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { productId } = route.params;
  const product = getProductById(productId);
  const dispatch = useAppDispatch();
  const { requireAuth } = useRequireAuth();
  const insets = useSafeAreaInsets();
  const isWishlisted = useAppSelector(state =>
    state.wishlist.productIds.includes(productId),
  );
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <View style={styles.notFoundWrap}>
        <TouchableOpacity style={styles.topBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.notFound}>Product not found</Text>
      </View>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product.id));
    }
    navigation.navigate('Cart');
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity style={styles.topBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={28} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.topBtn}>
          <Icon name="magnify" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.heroArea}>
        <View style={styles.pedestal}>
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>
        {product.sameDayDelivery ? (
          <View style={styles.sameDayPill}>
            <Icon name="flash" size={12} color={colors.white} />
            <Text style={styles.sameDayText}>Same Day</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.bottomCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleBlock}>
            <Text style={styles.brand}>ONG Gifting</Text>
            <Text style={styles.name}>{product.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.heartBtn}
            onPress={() =>
              requireAuth(
                () => dispatch(toggleWishlist(product.id)),
                'Login to save to wishlist',
              )
            }>
            <Icon
              name={isWishlisted ? 'heart' : 'heart-outline'}
              size={24}
              color={isWishlisted ? colors.accent : colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.ratingRow}>
          <StarRating rating={product.rating} size={16} />
          <Text style={styles.reviews}>({product.reviews} reviews)</Text>
        </View>

        <Text style={styles.description} numberOfLines={3}>
          {product.description}
        </Text>

        <View style={styles.tagRow}>
          {product.tags.map(tag => (
            <Badge key={tag} label={tag} variant="purple" style={styles.tag} />
          ))}
        </View>

        <View style={styles.qtyRow}>
          <Text style={styles.qtyLabel}>Quantity</Text>
          <View style={styles.qtyControl}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(q => Math.max(1, q - 1))}>
              <Icon name="minus" size={18} color={colors.skyBlue} />
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(q => q + 1)}>
              <Icon name="plus" size={18} color={colors.skyBlue} />
            </TouchableOpacity>
          </View>
        </View>

        <GradientButton
          title="Add to cart"
          icon="cart-outline"
          rightText={formatPrice(product.price * quantity)}
          onPress={handleAddToCart}
          fullWidth
          size="lg"
          style={styles.addBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.powderBlue,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  topBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  heroArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  pedestal: {
    width: width * 0.78,
    height: height * 0.38,
    borderRadius: width * 0.39,
    backgroundColor: colors.purpleLight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  productImage: {
    width: '88%',
    height: '88%',
  },
  sameDayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.green,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginTop: spacing.lg,
    gap: 4,
  },
  sameDayText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  bottomCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.huge,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  cardTitleBlock: {
    flex: 1,
    paddingRight: spacing.md,
  },
  brand: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
    marginBottom: 4,
  },
  name: {
    ...typography.h2,
    fontSize: 22,
  },
  heartBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  reviews: {
    ...typography.bodySmall,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  tag: {
    marginRight: spacing.xs,
  },
  qtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  qtyLabel: {
    ...typography.body,
    fontWeight: '600',
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    padding: 4,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    ...typography.h3,
    minWidth: 36,
    textAlign: 'center',
  },
  addBtn: {
    marginTop: spacing.sm,
  },
  notFoundWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  notFound: {
    ...typography.body,
    marginTop: spacing.xxl,
  },
});
