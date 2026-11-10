import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Img } from '../../components/Img';
import { Tap } from '../../components/Tap';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { BottomBar } from '../../components/BottomBar';
import { Chip, Field, InfoBanner, QtyStepper, Rating, SectionTitle, Tag, Divider } from '../../components/Bits';
import { ProductCard, WishHeart } from '../../components/ProductCard';
import { useToast } from '../../components/Toast';
import { productById, products, timeSlots } from '../../data/gifts';
import { img } from '../../data/images';
import { useAppDispatch, useAppSelector } from '../../store';
import { addToCart } from '../../store/slices/shop';
import { useNav, useStatusBar, useTheme } from '../../utils/hooks';
import { addDays, dayName, inr, pctOff } from '../../utils/format';
import { RootStackParamList } from '../../navigation/types';

const { width } = Dimensions.get('window');
const MSGS = ['Happy Birthday! 🎂', 'Happy Anniversary ❤️', 'Congratulations! 🎉', 'Thinking of you 💜'];
const REVIEWS = [
  { name: 'Ananya K.', avatar: img('avatar1', 120), rating: 5, text: 'Absolutely gorgeous and arrived 30 minutes early. My mom loved it!', date: '2 days ago' },
  { name: 'Rahul S.', avatar: img('avatar3', 120), rating: 5, text: 'Fresh, beautifully packed and the message card was a lovely touch.', date: '1 week ago' },
  { name: 'Meera P.', avatar: img('avatar6', 120), rating: 4, text: 'Great quality. Delivery partner called before arriving — very smooth.', date: '2 weeks ago' },
];

export const ProductDetailsScreen = () => {
  const { c } = useTheme();
  const nav = useNav();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  useStatusBar('dark-content');
  const { id } = useRoute<RouteProp<RootStackParamList, 'ProductDetails'>>().params;
  const p = productById(id);
  const userName = useAppSelector(s => s.app.user.name);
  const cartCount = useAppSelector(s => s.shop.cart.reduce((n, i) => n + i.qty, 0));
  const scroll = useRef<ScrollView>(null);

  const [imgIndex, setImgIndex] = useState(0);
  const [opts, setOpts] = useState<Record<string, string>>(() => Object.fromEntries(p.customizations.map(cz => [cz.label, cz.options[0].name])));
  const dates = Array.from({ length: 7 }, (_, i) => addDays(p.sameDay ? i : i + 1));
  const [date, setDate] = useState<string | null>(dates[0].toISOString());
  const [slot, setSlot] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState(userName);
  const [receiver, setReceiver] = useState('');
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState('');
  const [descOpen, setDescOpen] = useState(false);

  const extra = p.customizations.reduce((s, cz) => s + (cz.options.find(o => o.name === opts[cz.label])?.price || 0), 0);
  const unit = p.price + extra;
  const similar = products.filter(x => x.category === p.category && x.id !== p.id).slice(0, 8);

  const commit = () => {
    if (!slot) { setErr('Please choose a delivery time slot'); scroll.current?.scrollTo({ y: 560, animated: true }); return false; }
    dispatch(addToCart({ productId: p.id, qty, options: opts, extra, date: date || undefined, slot, message, sender, receiver }));
    return true;
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView ref={scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Gallery */}
        <View>
          <FlatList
            data={p.gallery}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={e => setImgIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
            keyExtractor={(u, i) => u + i}
            renderItem={({ item }) => <Img uri={item} style={{ width, height: width * 1.02 }} />}
          />
          <View style={[styles.galleryTop, { top: insets.top + 6 }]}>
            <Tap onPress={() => nav.goBack()} style={styles.gBtn}><Icon name="arrow-left" size={22} /></Tap>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Tap onPress={() => Share.share({ message: `Check out ${p.name} on Occasion — ${inr(p.price)}` })} style={styles.gBtn}><Icon name="share-variant-outline" size={20} /></Tap>
              <WishHeart productId={p.id} style={styles.gBtn} />
              <Tap onPress={() => nav.navigate('Cart')} style={styles.gBtn}>
                <Icon name="shopping-outline" size={20} />
                {cartCount ? <View style={[styles.badge, { backgroundColor: c.accent }]}><Text style={styles.badgeTxt}>{cartCount}</Text></View> : null}
              </Tap>
            </View>
          </View>
          <View style={styles.thumbs}>
            {p.gallery.map((u, i) => <View key={i} style={[styles.gDot, i === imgIndex && { width: 18, backgroundColor: '#fff' }]} />)}
          </View>
        </View>

        <View style={[styles.sheet, { backgroundColor: c.bg }]}>
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8 }}>
            {p.tags.map(t => <Tag key={t} label={t} />)}
            <Tag label={p.sameDay ? `⚡ Delivery ${p.eta}` : 'Next-day delivery'} bg={p.sameDay ? c.successSoft : c.lineSoft} color={p.sameDay ? c.success : c.sub} />
          </View>
          <Text style={{ fontSize: 21, fontWeight: '800', color: c.text, letterSpacing: -0.3 }}>{p.name}</Text>
          <Text style={{ fontSize: 13, color: c.sub, marginTop: 4 }}>{p.size} · Sold by <Text style={{ color: c.ink, fontWeight: '700' }}>{p.seller}</Text></Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <Rating value={p.rating} count={p.reviews} />
            <Text style={{ color: c.sub, fontSize: 12, marginLeft: 8 }}>· {Math.round(p.reviews / 3)} ratings with photos</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 14 }}>
            <Text style={{ fontSize: 26, fontWeight: '900', color: c.text }}>{inr(unit)}</Text>
            <Text style={{ fontSize: 15, color: c.muted, textDecorationLine: 'line-through', marginLeft: 8, marginBottom: 3 }}>{inr(p.mrp + extra)}</Text>
            <View style={[styles.offPill, { backgroundColor: c.successSoft }]}><Text style={{ color: c.success, fontWeight: '900', fontSize: 12 }}>{pctOff(p.price, p.mrp)}% OFF</Text></View>
          </View>
          <Text style={{ fontSize: 11, color: c.muted, marginTop: 2 }}>Inclusive of all taxes</Text>

          <View style={[styles.offerRow, { backgroundColor: c.white, borderColor: c.line }]}>
            <Icon name="ticket-percent-outline" size={20} color={c.accent} />
            <Text style={{ flex: 1, marginLeft: 8, fontSize: 12.5, fontWeight: '700', color: c.text }}>Get it for <Text style={{ color: c.success }}>{inr(Math.max(unit - 150, 0))}</Text> with code FIRSTGIFT</Text>
          </View>

          {/* Customizations */}
          {p.customizations.map(cz => (
            <View key={cz.label} style={{ marginTop: 18 }}>
              <Text style={styles.h}>{cz.label}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {cz.options.map(o => (
                  <Tap key={o.name} onPress={() => setOpts(s => ({ ...s, [cz.label]: o.name }))}
                    style={[styles.opt, { borderColor: opts[cz.label] === o.name ? c.ink : c.line, backgroundColor: opts[cz.label] === o.name ? c.tint : c.white }]}>
                    <Text style={{ fontWeight: '800', color: opts[cz.label] === o.name ? c.ink : c.text, fontSize: 13 }}>{o.name}</Text>
                    <Text style={{ fontSize: 11, color: c.sub, marginTop: 1 }}>{o.price ? `+ ${inr(o.price)}` : 'Included'}</Text>
                  </Tap>
                ))}
              </View>
            </View>
          ))}

          {/* Delivery date */}
          <View style={{ marginTop: 22 }}>
            <Text style={styles.h}>Select delivery date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {dates.map((d, i) => {
                const iso = d.toISOString();
                const on = date?.slice(0, 10) === iso.slice(0, 10);
                const isToday = p.sameDay && i === 0;
                return (
                  <Tap key={iso} onPress={() => setDate(iso)} style={[styles.date, { borderColor: on ? c.ink : c.line, backgroundColor: on ? c.primary : c.white }]}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: on ? c.onPrimary : c.sub }}>{isToday ? 'TODAY' : (p.sameDay ? i === 1 : i === 0) ? 'TMRW' : dayName(d.getDay()).toUpperCase()}</Text>
                    <Text style={{ fontSize: 20, fontWeight: '900', color: on ? c.onPrimary : c.text }}>{d.getDate()}</Text>
                  </Tap>
                );
              })}
            </ScrollView>
          </View>

          {/* Time slot */}
          <View style={{ marginTop: 18 }}>
            <Text style={styles.h}>Select time slot</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {timeSlots.map(t => {
                const on = slot === t.label;
                return (
                  <Tap key={t.id} onPress={() => { setSlot(t.label); setErr(''); }} style={[styles.slot, { borderColor: on ? c.ink : err ? c.danger : c.line, backgroundColor: on ? c.tint : c.white }]}>
                    <Icon name={t.id === 's5' ? 'weather-night' : 'clock-outline'} size={14} color={on ? c.ink : c.sub} />
                    <Text style={{ marginLeft: 5, fontWeight: on ? '800' : '600', color: on ? c.ink : c.text, fontSize: 12.5 }}>{t.label}</Text>
                    {t.fee ? <Text style={{ marginLeft: 4, fontSize: 11, color: c.accent, fontWeight: '800' }}>+₹{t.fee}</Text> : null}
                  </Tap>
                );
              })}
            </View>
            {err ? <Text style={{ color: c.danger, fontWeight: '700', marginTop: 8, fontSize: 12 }}>{err}</Text> : null}
          </View>

          {/* Personalisation */}
          <View style={[styles.box, { backgroundColor: c.white, borderColor: c.line }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Icon name="card-text-outline" size={20} color={c.ink} />
              <Text style={[styles.h, { marginBottom: 0, marginLeft: 8 }]}>Add a gift message <Text style={{ color: c.muted, fontWeight: '600' }}>(free card)</Text></Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
              {MSGS.map(m => <Chip key={m} label={m} on={message === m} onPress={() => setMessage(m)} />)}
            </ScrollView>
            <Field placeholder="Write something from the heart…" value={message} onChangeText={t => setMessage(t.slice(0, 200))} multiline style={{ marginBottom: 4 }} />
            <Text style={{ alignSelf: 'flex-end', fontSize: 11, color: c.muted, marginBottom: 10 }}>{message.length}/200</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Field label="From (sender)" icon="account-outline" value={sender} onChangeText={setSender} style={{ flex: 1 }} />
              <Field label="To (receiver)" icon="account-heart-outline" placeholder="Their name" value={receiver} onChangeText={setReceiver} style={{ flex: 1 }} />
            </View>
          </View>

          {/* Qty */}
          <View style={[styles.qtyRow, { backgroundColor: c.white, borderColor: c.line }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.h}>Quantity</Text>
              <Text style={{ fontSize: 12, color: c.sub, marginTop: -6 }}>Total {inr(unit * qty)}</Text>
            </View>
            <QtyStepper qty={qty} onChange={d => setQty(q => Math.max(1, Math.min(10, q + d)))} />
          </View>

          <View style={{ marginTop: 16 }}><InfoBanner icon="storefront-outline" text={`Fulfilled by ${p.seller}, a verified Occasion partner seller.`} /></View>

          {/* Description */}
          <View style={[styles.box, { backgroundColor: c.white, borderColor: c.line }]}>
            <Text style={styles.h}>Product details</Text>
            <Text style={{ color: c.sub, fontSize: 14, lineHeight: 21 }} numberOfLines={descOpen ? undefined : 3}>{p.description}</Text>
            <Tap onPress={() => setDescOpen(o => !o)}><Text style={{ color: c.ink, fontWeight: '800', marginTop: 6 }}>{descOpen ? 'Show less' : 'Read more'}</Text></Tap>
            <Divider />
            {p.highlights.map(h => (
              <View key={h} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Icon name="check-circle" size={16} color={c.success} />
                <Text style={{ marginLeft: 8, color: c.text, fontSize: 13, fontWeight: '600' }}>{h}</Text>
              </View>
            ))}
          </View>

          {/* Reviews */}
          <View style={[styles.box, { backgroundColor: c.white, borderColor: c.line }]}>
            <Text style={styles.h}>Ratings & reviews</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ alignItems: 'center', width: 96 }}>
                <Text style={{ fontSize: 36, fontWeight: '900', color: c.text }}>{p.rating}</Text>
                <View style={{ flexDirection: 'row' }}>{[1, 2, 3, 4, 5].map(i => <Icon key={i} name={i <= Math.round(p.rating) ? 'star' : 'star-outline'} size={14} color={c.gold} />)}</View>
                <Text style={{ fontSize: 11, color: c.sub, marginTop: 4 }}>{p.reviews.toLocaleString('en-IN')} ratings</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                {[5, 4, 3, 2, 1].map((s, i) => (
                  <View key={s} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 2 }}>
                    <Text style={{ width: 14, fontSize: 11, color: c.sub, fontWeight: '700' }}>{s}</Text>
                    <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: c.lineSoft, overflow: 'hidden' }}>
                      <View style={{ width: `${[72, 18, 6, 2, 2][i]}%`, height: 6, backgroundColor: s >= 3 ? c.success : c.warn }} />
                    </View>
                  </View>
                ))}
              </View>
            </View>
            {REVIEWS.map(r => (
              <View key={r.name} style={{ marginTop: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Img uri={r.avatar} style={{ width: 32, height: 32, borderRadius: 16 }} />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={{ fontWeight: '800', color: c.text, fontSize: 13 }}>{r.name}</Text>
                    <Text style={{ fontSize: 11, color: c.muted }}>{r.date} · Verified purchase</Text>
                  </View>
                  <Rating value={r.rating} small />
                </View>
                <Text style={{ color: c.sub, marginTop: 6, fontSize: 13, lineHeight: 19 }}>{r.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <SectionTitle title="Similar gifts" style={{ marginTop: 8 }} />
        <FlatList data={similar} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }} keyExtractor={x => x.id} renderItem={({ item }) => <ProductCard p={item} width={148} />} />
      </ScrollView>

      <BottomBar style={{ flexDirection: 'row', gap: 10 }}>
        <Button title="Add to cart" icon="cart-plus" variant="outline" style={{ flex: 1 }} onPress={() => { if (commit()) { toast.show(`${qty} × added to cart`, 'cart-check'); } }} />
        <Button title="Buy now" sub={inr(unit * qty)} style={{ flex: 1 }} onPress={() => { if (commit()) { nav.navigate('Cart'); } }} />
      </BottomBar>
    </View>
  );
};

const styles = StyleSheet.create({
  galleryTop: { position: 'absolute', left: 12, right: 12, flexDirection: 'row', justifyContent: 'space-between' },
  gBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.94)', alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 2, right: 2, minWidth: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  badgeTxt: { color: '#fff', fontSize: 9, fontWeight: '900' },
  thumbs: { position: 'absolute', bottom: 34, alignSelf: 'center', flexDirection: 'row' },
  gDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.55)', marginHorizontal: 3 },
  sheet: { marginTop: -22, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16, paddingTop: 20 },
  offPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginLeft: 10, marginBottom: 4 },
  offerRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', marginTop: 14 },
  h: { fontSize: 15, fontWeight: '800', color: '#1D1424', marginBottom: 10 },
  opt: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1.4, minWidth: 90 },
  date: { width: 60, height: 66, borderRadius: 14, borderWidth: 1.4, alignItems: 'center', justifyContent: 'center' },
  slot: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 11, height: 38, borderRadius: 10, borderWidth: 1.3 },
  box: { marginTop: 18, padding: 14, borderRadius: 16, borderWidth: 1 },
  qtyRow: { marginTop: 18, padding: 14, borderRadius: 16, borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
});
