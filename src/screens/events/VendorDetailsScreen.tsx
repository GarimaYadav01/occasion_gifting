import React, { useState } from 'react';
import { Dimensions, FlatList, Linking, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import LinearGradient from '../../components/Gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Img } from '../../components/Img';
import { Tap } from '../../components/Tap';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { BottomBar } from '../../components/BottomBar';
import { Sheet } from '../../components/Sheet';
import { Card, Chip, Field, Rating, Tag } from '../../components/Bits';
import { VendorHeart, VendorTile } from '../../components/VendorCard';
import { useToast } from '../../components/Toast';
import { serviceById, vendorById, vendorsFor } from '../../data/events';
import { img } from '../../data/images';
import { useAppDispatch, useAppSelector } from '../../store';
import { pickVendor, updatePick } from '../../store/slices/booking';
import { useNav, useStatusBar, useTheme } from '../../utils/hooks';
import { addDays, dayName, inr } from '../../utils/format';
import { RootStackParamList } from '../../navigation/types';

const { width } = Dimensions.get('window');
const TABS = ['Packages', 'Portfolio', 'Reviews', 'About'] as const;
const REVIEWS = [
  { name: 'Ishita R.', avatar: img('avatar5', 120), rating: 5, event: 'Birthday Party', text: 'Exceeded expectations! Setup was done 2 hours early and the team was super polite. Guests could not stop clicking pictures.' },
  { name: 'Karan M.', avatar: img('avatar7', 120), rating: 5, event: 'Engagement', text: 'Transparent pricing, no last-minute surprises. Coordinator kept us updated throughout.' },
  { name: 'Sneha D.', avatar: img('avatar4', 120), rating: 4, event: 'Corporate Event', text: 'Very professional and creative. Minor delay in cleanup but overall a great experience.' },
];

export const VendorDetailsScreen = () => {
  const { c } = useTheme();
  const nav = useNav();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  useStatusBar('light-content');
  const { id, fromBooking } = useRoute<RouteProp<RootStackParamList, 'VendorDetails'>>().params;
  const v = vendorById(id);
  const s = serviceById(v.service);
  const draft = useAppSelector(st => st.booking);
  const existing = draft.picks[v.service]?.vendorId === v.id ? draft.picks[v.service] : undefined;
  const [tab, setTab] = useState<(typeof TABS)[number]>('Packages');
  const [pkg, setPkg] = useState(existing?.packageId || v.packages[1].id);
  const [addons, setAddons] = useState<string[]>(existing?.addons || []);
  const [imgI, setImgI] = useState(0);
  const [enquiry, setEnquiry] = useState(false);
  const [enqMsg, setEnqMsg] = useState('');
  const [enqSent, setEnqSent] = useState(false);
  const [viewer, setViewer] = useState<string | null>(null);

  const p = v.packages.find(x => x.id === pkg)!;
  const total = p.price + v.addons.filter(a => addons.includes(a.id)).reduce((n, a) => n + a.price, 0);
  const days = Array.from({ length: 14 }, (_, i) => addDays(i + 1));
  const similar = vendorsFor(v.service).filter(x => x.id !== v.id);

  const book = () => {
    dispatch(pickVendor({ service: v.service, vendorId: v.id, packageId: pkg }));
    dispatch(updatePick({ service: v.service, patch: { addons } }));
    toast.show(`${v.name} added to your event`, 'clipboard-check');
    if (fromBooking) { nav.goBack(); return; }
    if (draft.eventType && draft.date) { nav.navigate('BookProviders', { service: v.service }); } else { nav.navigate('BookEventType'); }
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }} stickyHeaderIndices={[2]}>
        <View>
          <FlatList data={v.gallery} horizontal pagingEnabled showsHorizontalScrollIndicator={false} keyExtractor={(u, i) => u + i}
            onMomentumScrollEnd={e => setImgI(Math.round(e.nativeEvent.contentOffset.x / width))}
            renderItem={({ item }) => <Img uri={item} style={{ width, height: 300 + insets.top }} />} />
          <LinearGradient pointerEvents="none" colors={['rgba(0,0,0,0.45)', 'transparent', 'rgba(0,0,0,0.6)']} style={StyleSheet.absoluteFill} />
          <View style={[styles.top, { top: insets.top + 6 }]}>
            <Tap onPress={() => nav.goBack()} style={styles.btn}><Icon name="arrow-left" size={22} color="#fff" /></Tap>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Tap onPress={() => Share.share({ message: `${v.name} on Occasion` })} style={styles.btn}><Icon name="share-variant-outline" size={20} color="#fff" /></Tap>
              <VendorHeart id={v.id} />
            </View>
          </View>
          <View style={styles.counter}><Icon name="image-multiple" size={13} color="#fff" /><Text style={{ color: '#fff', fontSize: 11, fontWeight: '800', marginLeft: 4 }}>{imgI + 1}/{v.gallery.length}</Text></View>
        </View>

        <View style={[styles.info, { backgroundColor: c.bg }]}>
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8 }}>
            <Tag label={s.name} bg={c.tint} color={c.ink} />
            {v.tags.map(t => <Tag key={t} label={t} bg={c.goldSoft} color="#8A5A00" />)}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 22, fontWeight: '900', color: c.text, flexShrink: 1 }}>{v.name}</Text>
            {v.verified && <Icon name="check-decagram" size={20} color={c.info} style={{ marginLeft: 6 }} />}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
            <Rating value={v.rating} count={v.reviews} />
            <Icon name="map-marker-outline" size={14} color={c.sub} style={{ marginLeft: 10 }} />
            <Text style={{ color: c.sub, fontSize: 13, marginLeft: 2 }}>{v.area}, Bengaluru</Text>
          </View>
          <View style={[styles.statRow, { backgroundColor: c.white, borderColor: c.line }]}>
            {[[`${v.experience}+ yrs`, 'Experience', 'medal-outline'], [`${(v.bookings / 1000).toFixed(1)}k`, 'Bookings', 'calendar-check-outline'], [v.responseTime.replace('within ', ''), 'Responds in', 'lightning-bolt-outline'], ...(v.capacity ? [[v.capacity.split(' ')[0], 'Guests', 'account-group-outline']] : [])].map(([a, b, i]) => (
              <View key={b} style={{ flex: 1, alignItems: 'center' }}>
                <Icon name={i} size={18} color={c.ink} />
                <Text style={{ fontWeight: '900', color: c.text, marginTop: 4, fontSize: 13 }}>{a}</Text>
                <Text style={{ fontSize: 10.5, color: c.sub }}>{b}</Text>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
            <Button title="Call" icon="phone-outline" variant="outline" size="md" style={{ flex: 1 }} onPress={() => Linking.openURL('tel:+918000000000')} />
            <Button title="Enquire" icon="chat-processing-outline" variant="soft" size="md" style={{ flex: 1 }} onPress={() => setEnquiry(true)} />
          </View>
        </View>

        {/* Sticky tabs */}
        <View style={{ backgroundColor: c.bg, paddingTop: 6 }}>
          <View style={[styles.tabs, { borderBottomColor: c.line }]}>
            {TABS.map(t => (
              <Tap key={t} onPress={() => setTab(t)} style={styles.tab}>
                <Text style={{ fontWeight: tab === t ? '900' : '600', color: tab === t ? c.ink : c.sub, fontSize: 14 }}>{t}</Text>
                {tab === t && <View style={[styles.tabLine, { backgroundColor: c.ink }]} />}
              </Tap>
            ))}
          </View>
        </View>

        <View style={{ padding: 16 }}>
          {tab === 'Packages' && (
            <>
              {v.packages.map(x => {
                const on = x.id === pkg;
                return (
                  <Tap key={x.id} scale={0.99} onPress={() => setPkg(x.id)} style={[styles.pkg, { backgroundColor: on ? c.tint : c.white, borderColor: on ? c.ink : c.line, borderWidth: on ? 1.8 : 1 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Icon name={on ? 'radiobox-marked' : 'radiobox-blank'} size={22} color={on ? c.ink : c.muted} />
                      <Text style={{ fontSize: 17, fontWeight: '900', color: c.text, marginLeft: 8, flex: 1 }}>{x.name}</Text>
                      {x.popular && <Tag label="Most popular" />}
                    </View>
                    <Text style={{ fontSize: 22, fontWeight: '900', color: c.text, marginTop: 8 }}>{inr(x.price)} <Text style={{ fontSize: 12, color: c.sub, fontWeight: '600' }}>{v.unit}</Text></Text>
                    <View style={{ marginTop: 8 }}>
                      {x.includes.map(inc => (
                        <View key={inc} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                          <Icon name="check" size={15} color={c.success} />
                          <Text style={{ marginLeft: 6, color: c.text, fontSize: 13 }}>{inc}</Text>
                        </View>
                      ))}
                    </View>
                  </Tap>
                );
              })}
              <Text style={styles.h}>Add-ons</Text>
              {v.addons.map(a => {
                const on = addons.includes(a.id);
                return (
                  <Tap key={a.id} onPress={() => setAddons(l => (on ? l.filter(x => x !== a.id) : [...l, a.id]))} style={[styles.addon, { backgroundColor: c.white, borderColor: on ? c.ink : c.line }]}>
                    <Icon name={on ? 'checkbox-marked' : 'checkbox-blank-outline'} size={22} color={on ? c.ink : c.muted} />
                    <Text style={{ flex: 1, marginLeft: 10, fontWeight: '700', color: c.text }}>{a.name}</Text>
                    <Text style={{ fontWeight: '800', color: c.text }}>+ {inr(a.price)}</Text>
                  </Tap>
                );
              })}
              <Text style={styles.h}>Availability · next 2 weeks</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {days.map(d => {
                  const busy = v.busy.includes(d.getDate());
                  return (
                    <View key={d.toISOString()} style={[styles.day, { backgroundColor: busy ? c.lineSoft : c.successSoft }]}>
                      <Text style={{ fontSize: 10, fontWeight: '800', color: busy ? c.muted : c.success }}>{dayName(d.getDay()).toUpperCase()}</Text>
                      <Text style={{ fontSize: 17, fontWeight: '900', color: busy ? c.muted : c.text, textDecorationLine: busy ? 'line-through' : 'none' }}>{d.getDate()}</Text>
                      <Text style={{ fontSize: 9, fontWeight: '700', color: busy ? c.muted : c.success }}>{busy ? 'Booked' : 'Open'}</Text>
                    </View>
                  );
                })}
              </ScrollView>
            </>
          )}
          {tab === 'Portfolio' && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {[...v.gallery, ...v.gallery].map((u, i) => (
                <Tap key={i} onPress={() => setViewer(u)} style={{ width: (width - 48) / 3, height: (width - 48) / 3 * (i % 3 === 1 ? 1.3 : 1) }}>
                  <Img uri={u.replace('w=900', 'w=400')} style={{ flex: 1, borderRadius: 12 }} />
                </Tap>
              ))}
            </View>
          )}
          {tab === 'Reviews' && (
            <>
              <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 40, fontWeight: '900', color: c.text }}>{v.rating}</Text>
                <View style={{ marginLeft: 12 }}>
                  <View style={{ flexDirection: 'row' }}>{[1, 2, 3, 4, 5].map(i => <Icon key={i} name="star" size={16} color={i <= Math.round(v.rating) ? c.gold : c.line} />)}</View>
                  <Text style={{ color: c.sub, marginTop: 2 }}>{v.reviews} verified reviews</Text>
                </View>
              </Card>
              {REVIEWS.map(r => (
                <Card key={r.name} style={{ marginTop: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Img uri={r.avatar} style={{ width: 36, height: 36, borderRadius: 18 }} />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={{ fontWeight: '800', color: c.text }}>{r.name}</Text>
                      <Text style={{ fontSize: 11, color: c.sub }}>{r.event}</Text>
                    </View>
                    <Rating value={r.rating} small />
                  </View>
                  <Text style={{ color: c.sub, marginTop: 8, lineHeight: 19, fontSize: 13 }}>{r.text}</Text>
                </Card>
              ))}
            </>
          )}
          {tab === 'About' && (
            <Card>
              <Text style={{ color: c.text, lineHeight: 21, fontSize: 14 }}>{v.description}</Text>
              <Text style={[styles.h, { marginTop: 14 }]}>Services offered</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{v.subs.map(x => <Chip key={x} label={x} style={{ marginRight: 0 }} />)}</View>
              <Text style={[styles.h, { marginTop: 14 }]}>Policies</Text>
              {['20% advance to confirm booking', 'Free cancellation up to 7 days before event', 'GST invoice provided', 'Occasion-verified background & quality checks'].map(x => (
                <View key={x} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                  <Icon name="shield-check-outline" size={16} color={c.success} />
                  <Text style={{ marginLeft: 8, color: c.text, fontSize: 13 }}>{x}</Text>
                </View>
              ))}
            </Card>
          )}
        </View>

        {similar.length > 0 && (
          <>
            <Text style={[styles.h, { marginHorizontal: 16 }]}>Similar vendors</Text>
            <FlatList data={similar} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }} keyExtractor={x => x.id} renderItem={({ item }) => <VendorTile v={item} fromBooking={fromBooking} />} />
          </>
        )}
      </ScrollView>

      <BottomBar style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 11, color: c.sub, fontWeight: '700' }}>{p.name.toUpperCase()} PACKAGE</Text>
          <Text style={{ fontSize: 20, fontWeight: '900', color: c.text }}>{inr(total)}</Text>
          <Text style={{ fontSize: 11, color: c.sub }}>{v.unit}{addons.length ? ` · ${addons.length} add-on` : ''}</Text>
        </View>
        <Button title={existing ? 'Update selection' : fromBooking ? 'Add to event' : 'Book now'} iconRight="arrow-right" onPress={book} style={{ flex: 1.3 }} />
      </BottomBar>

      <Sheet visible={enquiry} onClose={() => { setEnquiry(false); setEnqSent(false); }} title={enqSent ? undefined : `Enquire with ${v.name}`}>
        {enqSent ? (
          <View style={{ alignItems: 'center', paddingVertical: 24 }}>
            <View style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: c.successSoft, alignItems: 'center', justifyContent: 'center' }}><Icon name="send-check" size={34} color={c.success} /></View>
            <Text style={{ fontSize: 19, fontWeight: '900', color: c.text, marginTop: 14 }}>Enquiry sent!</Text>
            <Text style={{ color: c.sub, marginTop: 4, textAlign: 'center' }}>{v.name} usually responds {v.responseTime}. We'll notify you.</Text>
            <Button title="Done" onPress={() => { setEnquiry(false); setEnqSent(false); }} style={{ alignSelf: 'stretch', marginTop: 20 }} />
          </View>
        ) : (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              {['Is my date available?', 'Can you customise the package?', 'Do you travel outside the city?'].map(q => <Chip key={q} label={q} on={enqMsg === q} onPress={() => setEnqMsg(q)} />)}
            </ScrollView>
            <Field placeholder="Tell them about your event — date, guests, theme…" value={enqMsg} onChangeText={setEnqMsg} multiline />
            <Button title="Send enquiry" icon="send" disabled={enqMsg.trim().length < 4} onPress={() => setEnqSent(true)} />
          </>
        )}
      </Sheet>

      <Sheet visible={!!viewer} onClose={() => setViewer(null)}>
        {viewer ? <Img uri={viewer} style={{ height: width, borderRadius: 18, marginBottom: 10 }} /> : null}
      </Sheet>
    </View>
  );
};

const styles = StyleSheet.create({
  top: { position: 'absolute', left: 12, right: 12, flexDirection: 'row', justifyContent: 'space-between' },
  btn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  counter: { position: 'absolute', bottom: 34, right: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  info: { marginTop: -22, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16, paddingTop: 20 },
  statRow: { flexDirection: 'row', padding: 12, borderRadius: 16, borderWidth: 1, marginTop: 14 },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, paddingHorizontal: 8 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  tabLine: { position: 'absolute', bottom: -1, height: 3, width: 40, borderRadius: 2 },
  pkg: { padding: 14, borderRadius: 16, marginBottom: 10 },
  h: { fontSize: 16, fontWeight: '900', color: '#1D1424', marginTop: 18, marginBottom: 10 },
  addon: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1.2, marginBottom: 8 },
  day: { width: 58, paddingVertical: 8, borderRadius: 12, alignItems: 'center' },
});
