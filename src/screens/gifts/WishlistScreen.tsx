import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { Chip } from '../../components/Bits';
import { ProductRow } from '../../components/ProductCard';
import { VendorRow } from '../../components/VendorCard';
import { Tap } from '../../components/Tap';
import { Icon } from '../../components/Icon';
import { EmptyState } from '../../components/States';
import { useToast } from '../../components/Toast';
import { productById, products } from '../../data/gifts';
import { vendorById } from '../../data/events';
import { useAppDispatch, useAppSelector } from '../../store';
import { quickQty, toggleWishProduct } from '../../store/slices/shop';
import { useNav, useTheme } from '../../utils/hooks';

export const WishlistScreen = () => {
  const { c, mode } = useTheme();
  const nav = useNav();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const wp = useAppSelector(s => s.shop.wishProducts);
  const wv = useAppSelector(s => s.shop.wishVendors);
  const [tab, setTab] = useState<'gifts' | 'vendors'>(mode === 'events' ? 'vendors' : 'gifts');

  const moveToCart = (id: string) => {
    dispatch(quickQty({ productId: id, delta: 1 }));
    dispatch(toggleWishProduct(id));
    toast.show('Moved to cart', 'cart-arrow-right');
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <AppHeader title="My Wishlist" subtitle={`${wp.length + wv.length} saved`} actions={['cart']} />
      <View style={{ flexDirection: 'row', padding: 12, paddingHorizontal: 16 }}>
        <Chip label={`Gifts (${wp.length})`} icon="gift-outline" on={tab === 'gifts'} onPress={() => setTab('gifts')} />
        <Chip label={`Vendors (${wv.length})`} icon="storefront-outline" on={tab === 'vendors'} onPress={() => setTab('vendors')} />
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
        {tab === 'gifts' ? (
          wp.length === 0 ? (
            <EmptyState icon="heart-outline" title="Your wishlist is empty" body="Tap the ♡ on any gift to save it here for later." cta="Explore gifts" onCta={() => nav.navigate('Main', { screen: 'Gifts' })} />
          ) : (
            <>
              {wp.length > 1 && (
                <Tap onPress={() => { wp.forEach(id => dispatch(quickQty({ productId: id, delta: 1 }))); wp.forEach(id => dispatch(toggleWishProduct(id))); toast.show('All items moved to cart', 'cart-check'); }}
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: c.tint, padding: 12, borderRadius: 12, marginBottom: 12 }}>
                  <Icon name="cart-arrow-right" size={18} color={c.ink} />
                  <Text style={{ color: c.ink, fontWeight: '800', marginLeft: 6 }}>Move all to cart</Text>
                </Tap>
              )}
              {wp.map(id => (
                <View key={id}>
                  <ProductRow p={productById(id)} right={
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      <Tap onPress={() => { dispatch(toggleWishProduct(id)); toast.show('Removed from wishlist', 'heart-off'); }} style={{ width: 34, height: 34, borderRadius: 9, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="trash-can-outline" size={17} color={c.danger} />
                      </Tap>
                      <Tap onPress={() => moveToCart(id)} style={{ paddingHorizontal: 10, height: 34, borderRadius: 9, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: c.onPrimary, fontWeight: '800', fontSize: 12 }}>Move to cart</Text>
                      </Tap>
                    </View>
                  } />
                </View>
              ))}
              <Text style={{ fontSize: 15, fontWeight: '800', color: c.text, marginTop: 12, marginBottom: 10 }}>You may also like</Text>
              {products.filter(p => !wp.includes(p.id)).slice(0, 3).map(p => <ProductRow key={p.id} p={p} />)}
            </>
          )
        ) : wv.length === 0 ? (
          <EmptyState icon="storefront-outline" title="No saved vendors" body="Save decorators, caterers & venues to compare them later." cta="Browse vendors" onCta={() => nav.navigate('Main', { screen: 'Events' })} />
        ) : (
          wv.map(id => <VendorRow key={id} v={vendorById(id)} />)
        )}
      </ScrollView>
    </View>
  );
};
