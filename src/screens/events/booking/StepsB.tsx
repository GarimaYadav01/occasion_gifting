import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { BookingShell } from '../../../components/BookingShell';
import { Card, Chip, Field, InfoBanner } from '../../../components/Bits';
import { VendorRow } from '../../../components/VendorCard';
import { FakeMap, MAP_SIZE } from '../../../components/FakeMap';
import { Tap } from '../../../components/Tap';
import { Img } from '../../../components/Img';
import { Icon } from '../../../components/Icon';
import { EmptyState } from '../../../components/States';
import { serviceById, vendorById, vendorsFor } from '../../../data/events';
import { useAppDispatch, useAppSelector } from '../../../store';
import { pickVendor, removeService, setDraft, updatePick } from '../../../store/slices/booking';
import { useNav, useTheme } from '../../../utils/hooks';
import { bookingTotals, serviceAmount } from '../../../utils/pricing';
import { inr } from '../../../utils/format';
import { RootStackParamList } from '../../../navigation/types';

const { width, height } = Dimensions.get('window');

const Total = ({ amount, label }: { amount: number; label: string }) => {
  const { c } = useTheme();
  return (
    <View>
      <Text style={{ fontSize: 11, color: c.sub, fontWeight: '700' }}>{label}</Text>
      <Text style={{ fontSize: 19, fontWeight: '900', color: c.text }}>{inr(amount)}</Text>
    </View>
  );
};

/* Step 5 — Browse service providers */
export const BookProvidersScreen = () => {
  const { c } = useTheme();
  const nav = useNav();
  const dispatch = useAppDispatch();
  const route = useRoute<RouteProp<RootStackParamList, 'BookProviders'>>();
  const d = useAppSelector(s => s.booking);
  const [active, setActive] = useState(route.params?.service && d.services.includes(route.params.service) ? route.params.service : d.services[0]);
  const done = d.services.filter(s => d.picks[s]?.vendorId).length;
  const all = done === d.services.length && d.services.length > 0;
  const svc = active ? serviceById(active) : undefined;
  const t = bookingTotals(d);

  const select = (vid: string) => {
    dispatch(pickVendor({ service: active!, vendorId: vid }));
    const nextMissing = d.services.find(s => s !== active && !d.picks[s]?.vendorId);
    if (nextMissing) { setTimeout(() => setActive(nextMissing), 350); }
  };

  if (!d.services.length) {
    return (
      <BookingShell step={5} title="Choose vendors" cta="Select services" onNext={() => nav.navigate('BookServices')}>
        <EmptyState icon="clipboard-text-outline" title="No services selected" body="Go back and pick at least one service for your event." />
      </BookingShell>
    );
  }

  return (
    <BookingShell step={5} title="Choose your vendors" subtitle={`${done} of ${d.services.length} services selected · tap a card for packages`} cta={all ? 'Customize' : 'Pick all vendors'} disabled={!all}
      onNext={() => nav.navigate('BookCustomize')} footerLeft={<Total amount={t.subtotal} label="ESTIMATE" />}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
        {d.services.map(s => {
          const picked = !!d.picks[s]?.vendorId;
          return <Chip key={s} label={serviceById(s).short} icon={picked ? 'check-circle' : serviceById(s).icon} on={active === s} onPress={() => setActive(s)} />;
        })}
        <Chip label="Add" icon="plus" onPress={() => nav.navigate('BookServices')} />
      </ScrollView>
      {svc && (
        <>
          <Text style={{ fontSize: 16, fontWeight: '900', color: c.text, marginBottom: 10 }}>{svc.name} vendors near you</Text>
          {vendorsFor(svc.id).map(v => <VendorRow key={v.id} v={v} fromBooking selected={d.picks[svc.id]?.vendorId === v.id} onSelect={() => select(v.id)} />)}
        </>
      )}
    </BookingShell>
  );
};

/* Step 6 — Customize selected services */
export const BookCustomizeScreen = () => {
  const { c } = useTheme();
  const nav = useNav();
  const dispatch = useAppDispatch();
  const d = useAppSelector(s => s.booking);
  const t = bookingTotals(d);
  return (
    <BookingShell step={6} title="Customize services" subtitle="Fine-tune packages, add-ons and special requests" cta="Choose location" disabled={!d.services.length}
      onNext={() => nav.navigate('BookVenue')} footerLeft={<Total amount={t.subtotal} label="SUBTOTAL" />}>
      {d.services.length === 0 && <EmptyState compact icon="clipboard-remove-outline" title="All services removed" body="Add a service to continue." cta="Add services" onCta={() => nav.navigate('BookServices')} />}
      {d.services.map(s => {
        const pick = d.picks[s];
        if (!pick?.vendorId) { return null; }
        const v = vendorById(pick.vendorId);
        return (
          <Card key={s} style={{ marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Img uri={v.image} style={{ width: 52, height: 52, borderRadius: 12 }} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ fontSize: 11, fontWeight: '900', color: c.ink }}>{serviceById(s).name.toUpperCase()}</Text>
                <Text style={{ fontWeight: '800', color: c.text, fontSize: 15 }} numberOfLines={1}>{v.name}</Text>
                <Tap onPress={() => nav.navigate('BookProviders', { service: s })}><Text style={{ color: c.ink, fontWeight: '700', fontSize: 12 }}>Change vendor</Text></Tap>
              </View>
              <Tap onPress={() => dispatch(removeService(s))} style={[styles.iconBtn, { backgroundColor: c.dangerSoft }]}><Icon name="trash-can-outline" size={18} color={c.danger} /></Tap>
            </View>
            <Text style={styles.label}>Package</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {v.packages.map(p => {
                const on = pick.packageId === p.id;
                return (
                  <Tap key={p.id} onPress={() => dispatch(updatePick({ service: s, patch: { packageId: p.id } }))} style={[styles.pkg, { borderColor: on ? c.ink : c.line, backgroundColor: on ? c.tint : c.white }]}>
                    <Text style={{ fontWeight: '900', color: on ? c.ink : c.text }}>{p.name}</Text>
                    <Text style={{ fontSize: 11, color: c.sub, marginTop: 2 }}>{inr(p.price)}</Text>
                  </Tap>
                );
              })}
            </View>
            <Text style={styles.label}>Add-ons</Text>
            {v.addons.map(a => {
              const on = pick.addons.includes(a.id);
              return (
                <Tap key={a.id} onPress={() => dispatch(updatePick({ service: s, patch: { addons: on ? pick.addons.filter(x => x !== a.id) : [...pick.addons, a.id] } }))} style={styles.addon}>
                  <Icon name={on ? 'checkbox-marked' : 'checkbox-blank-outline'} size={22} color={on ? c.ink : c.muted} />
                  <Text style={{ flex: 1, marginLeft: 8, color: c.text, fontWeight: '600' }}>{a.name}</Text>
                  <Text style={{ fontWeight: '800', color: c.text }}>+{inr(a.price)}</Text>
                </Tap>
              );
            })}
            <Field label="Special requests" placeholder={s === 'catering' ? 'e.g. Jain food, no onion-garlic counter' : s === 'decoration' ? 'e.g. Pastel unicorn theme, name banner' : 'Anything the vendor should know'} value={pick.notes} onChangeText={x => dispatch(updatePick({ service: s, patch: { notes: x } }))} style={{ marginTop: 12, marginBottom: 6 }} />
            <View style={styles.lineTotal}>
              <Text style={{ color: c.sub, fontWeight: '600' }}>{v.unit === 'per plate' ? `${inr(v.packages.find(p => p.id === pick.packageId)!.price)} × ${d.guests} guests` : 'Service total'}</Text>
              <Text style={{ fontWeight: '900', color: c.text, fontSize: 16 }}>{inr(serviceAmount(s, pick, d.guests))}</Text>
            </View>
          </Card>
        );
      })}
    </BookingShell>
  );
};

/* Step 7 — Venue or address */
export const BookVenueScreen = () => {
  const { c } = useTheme();
  const nav = useNav();
  const dispatch = useAppDispatch();
  const d = useAppSelector(s => s.booking);
  const addresses = useAppSelector(s => s.profile.addresses);
  const bookedVenue = d.picks.venue?.vendorId;
  const mode = bookedVenue ? 'venue' : d.venue.mode;
  const venueId = bookedVenue || d.venue.vendorId;
  const [err, setErr] = useState('');
  const set = (patch: Partial<typeof d.venue>) => dispatch(setDraft({ venue: { ...d.venue, ...patch } }));

  const next = () => {
    if (mode === 'venue' && !venueId) { setErr('Please select a venue'); return; }
    if (mode === 'address' && (d.venue.address || '').trim().length < 8) { setErr('Please enter the full event address'); return; }
    if (bookedVenue) { set({ mode: 'venue', vendorId: bookedVenue }); }
    nav.navigate('BookMap');
  };

  return (
    <BookingShell step={7} title="Where's the event?" subtitle="Pick a partner venue or use your own place" cta="Confirm on map" onNext={next}>
      <View style={[styles.seg, { backgroundColor: c.lineSoft }]}>
        {([['venue', 'Book a venue', 'domain'], ['address', 'My own address', 'home-map-marker']] as const).map(([k, l, i]) => {
          const on = mode === k;
          return (
            <Tap key={k} disabled={!!bookedVenue && k === 'address'} onPress={() => { set({ mode: k }); setErr(''); }} style={[styles.segItem, on && { backgroundColor: c.white }]}>
              <Icon name={i} size={18} color={on ? c.ink : c.sub} />
              <Text style={{ marginLeft: 6, fontWeight: on ? '900' : '600', color: on ? c.ink : c.sub }}>{l}</Text>
            </Tap>
          );
        })}
      </View>
      {bookedVenue && <View style={{ marginBottom: 12 }}><InfoBanner icon="check-decagram" tone="success" text="You've already booked a venue as a service — it's used as your event location." /></View>}
      {err ? <Text style={{ color: c.danger, fontWeight: '700', marginBottom: 10 }}>{err}</Text> : null}
      {mode === 'venue' ? (
        vendorsFor('venue').map(v => {
          const on = venueId === v.id;
          return (
            <Tap key={v.id} scale={0.99} disabled={!!bookedVenue && !on} onPress={() => { set({ vendorId: v.id }); setErr(''); }} style={[styles.venue, { backgroundColor: c.white, borderColor: on ? c.ink : c.line, borderWidth: on ? 2 : 1, opacity: bookedVenue && !on ? 0.45 : 1 }]}>
              <Img uri={v.image} style={{ width: 90, height: 90, borderRadius: 12 }} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ fontWeight: '900', color: c.text, fontSize: 15 }} numberOfLines={1}>{v.name}</Text>
                <Text style={{ fontSize: 12, color: c.sub, marginTop: 2 }}>{v.subs.join(' · ')} · {v.area}</Text>
                <Text style={{ fontSize: 12, color: c.sub, marginTop: 2 }}><Icon name="account-group" size={12} color={c.sub} /> {v.capacity}</Text>
                <Text style={{ fontSize: 13, color: c.text, fontWeight: '800', marginTop: 6 }}>{inr(v.priceFrom)} <Text style={{ fontSize: 11, color: c.sub, fontWeight: '600' }}>{v.unit}</Text></Text>
              </View>
              <Icon name={on ? 'radiobox-marked' : 'radiobox-blank'} size={24} color={on ? c.ink : c.muted} />
            </Tap>
          );
        })
      ) : (
        <>
          <Text style={styles.label}>Use a saved address</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
            {addresses.map(a => <Chip key={a.id} label={a.label} icon="map-marker-outline" on={d.venue.address?.startsWith(a.line)} onPress={() => { set({ address: `${a.line}, ${a.area}, ${a.city} ${a.pin}` }); setErr(''); }} />)}
          </ScrollView>
          <Field label="Full event address" icon="map-marker-outline" placeholder="House / building, street, area, city" value={d.venue.address} onChangeText={x => set({ address: x })} multiline />
          <Field label="Landmark (optional)" icon="sign-direction" placeholder="e.g. Opposite Forum Mall" value={d.venue.landmark} onChangeText={x => set({ landmark: x })} />
          <InfoBanner icon="information-outline" text="Vendors will visit 2–4 hours before the event to set up. Make sure there's access & parking." />
        </>
      )}
    </BookingShell>
  );
};

/* Step 8 — Interactive map */
const AREAS = ['Koramangala', 'Indiranagar', 'HSR Layout', 'MG Road', 'Whitefield', 'Bellandur'];
export const BookMapScreen = () => {
  const { c } = useTheme();
  const nav = useNav();
  const dispatch = useAppDispatch();
  const d = useAppSelector(s => s.booking);
  const venues = vendorsFor('venue');
  const mapH = height * 0.5;
  const [area, setArea] = useState(d.venue.mode === 'venue' && d.venue.vendorId ? vendorById(d.venue.vendorId).area : 'Koramangala');
  const [recenter, setRecenter] = useState<number | undefined>(undefined);
  const sel = d.venue.mode === 'venue' ? d.venue.vendorId : undefined;
  const v = sel ? vendorById(sel) : undefined;

  const onMove = (p: { x: number; y: number }) => {
    const i = Math.floor((p.x / MAP_SIZE.W) * 3) + (p.y > MAP_SIZE.H / 2 ? 3 : 0);
    setArea(AREAS[Math.max(0, Math.min(5, i))]);
  };

  return (
    <BookingShell step={8} title="Confirm location" subtitle="Drag the map to fine-tune the pin" cta="Looks good" scroll={false} onNext={() => nav.navigate('BookReview')}>
      <View>
        <FakeMap width={width} height={mapH} recenterKey={recenter}
          markers={venues.map(x => ({ id: x.id, x: x.map!.x, y: x.map!.y, label: x.name, price: x.name.split(' ').slice(0, 2).join(' ') }))}
          selected={sel}
          onSelectMarker={id => { dispatch(setDraft({ venue: { mode: 'venue', vendorId: id } })); setArea(vendorById(id).area); }}
          onMove={onMove} />
        {/* Center pin (for own-address mode) */}
        {d.venue.mode === 'address' && (
          <View pointerEvents="none" style={[styles.pin, { top: mapH / 2 - 44, left: width / 2 - 18 }]}>
            <View style={[styles.pinHead, { backgroundColor: c.primary }]}><Icon name="home-heart" size={18} color={c.onPrimary} /></View>
            <View style={[styles.pinStem, { backgroundColor: c.primary }]} />
            <View style={styles.pinShadow} />
          </View>
        )}
        <Tap onPress={() => setRecenter(Date.now())} style={[styles.gps, { backgroundColor: c.white }]}><Icon name="crosshairs-gps" size={22} color={c.ink} /></Tap>
        <View style={[styles.zoom, { backgroundColor: c.white }]}>
          <Icon name="plus" size={20} /><View style={{ height: 1, backgroundColor: c.line, marginVertical: 6 }} /><Icon name="minus" size={20} />
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
          {v ? <Img uri={v.image} style={{ width: 56, height: 56, borderRadius: 12 }} /> : <View style={[styles.locIcon, { backgroundColor: c.tint }]}><Icon name="map-marker-radius" size={26} color={c.ink} /></View>}
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontSize: 11, fontWeight: '900', color: c.ink }}>{v ? 'PARTNER VENUE' : 'EVENT LOCATION'}</Text>
            <Text style={{ fontWeight: '900', fontSize: 15, color: c.text }} numberOfLines={1}>{v ? v.name : area}</Text>
            <Text style={{ fontSize: 12, color: c.sub, marginTop: 2 }} numberOfLines={2}>{v ? `${v.area}, Bengaluru · ${v.capacity}` : d.venue.address || `${area}, Bengaluru`}</Text>
          </View>
          <Tap onPress={() => nav.goBack()}><Text style={{ color: c.ink, fontWeight: '800' }}>Change</Text></Tap>
        </Card>
        <View style={{ flexDirection: 'row', marginTop: 12, gap: 8 }}>
          {[['car', '18 min drive'], ['parking', 'Parking available'], ['map-marker-distance', '6.2 km']].map(([i, l]) => (
            <View key={l} style={[styles.meta, { backgroundColor: c.white, borderColor: c.line }]}><Icon name={i} size={14} color={c.sub} /><Text style={{ fontSize: 11, fontWeight: '700', color: c.text, marginLeft: 4 }}>{l}</Text></View>
          ))}
        </View>
        <Text style={{ fontSize: 11, color: c.muted, marginTop: 10 }}>Tip: tap a venue bubble on the map to switch venues.</Text>
      </ScrollView>
    </BookingShell>
  );
};

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '800', color: '#6B6275', marginTop: 14, marginBottom: 8 },
  iconBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  pkg: { flex: 1, padding: 10, borderRadius: 12, borderWidth: 1.4, alignItems: 'center' },
  addon: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7 },
  lineTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#EFE7EE', paddingTop: 10 },
  seg: { flexDirection: 'row', padding: 4, borderRadius: 14, marginBottom: 14 },
  segItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 42, borderRadius: 11 },
  venue: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 16, marginBottom: 10 },
  pin: { position: 'absolute', alignItems: 'center', width: 36 },
  pinHead: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff' },
  pinStem: { width: 3, height: 10 },
  pinShadow: { width: 14, height: 5, borderRadius: 7, backgroundColor: 'rgba(0,0,0,0.25)' },
  gps: { position: 'absolute', right: 14, bottom: 14, width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6 },
  zoom: { position: 'absolute', right: 14, top: 14, padding: 8, borderRadius: 12, elevation: 4, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6 },
  locIcon: { width: 56, height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  meta: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 10, borderWidth: 1 },
});
