import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  closeLocationSheet,
  setDeliveryLocation,
  DeliveryLocation,
} from '../../store/slices/locationSlice';
import { setDeliveryAddress } from '../../store/slices/cartSlice';
import { GradientButton } from '../ui/GradientButton';
import { Icon } from '../ui/Icon';
import { colors, radius, spacing, typography } from '../../theme';

const { height: SCREEN_H } = Dimensions.get('window');

const AREA_SUGGESTIONS = [
  { shortLabel: 'Andheri West', city: 'Mumbai', pincode: '400053', lat: 19.1334, lng: 72.8267 },
  { shortLabel: 'Bandra West', city: 'Mumbai', pincode: '400050', lat: 19.0596, lng: 72.8295 },
  { shortLabel: 'Powai', city: 'Mumbai', pincode: '400076', lat: 19.1197, lng: 72.9051 },
  { shortLabel: 'Juhu', city: 'Mumbai', pincode: '400049', lat: 19.1075, lng: 72.8263 },
  { shortLabel: 'Lower Parel', city: 'Mumbai', pincode: '400013', lat: 19.0005, lng: 72.8302 },
];

export const LocationBottomSheet: React.FC = () => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const visible = useAppSelector(state => state.location.sheetVisible);
  const current = useAppSelector(state => state.location.current);
  const saved = useAppSelector(state => state.location.saved);

  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState<DeliveryLocation>(current);
  const [addressLine, setAddressLine] = useState(current.addressLine);
  const [step, setStep] = useState<'search' | 'confirm'>('search');

  useEffect(() => {
    if (visible) {
      setDraft(current);
      setAddressLine(current.addressLine);
      setQuery('');
      setStep('search');
    }
  }, [visible, current]);

  const filtered = AREA_SUGGESTIONS.filter(
    a =>
      !query.trim() ||
      a.shortLabel.toLowerCase().includes(query.toLowerCase()) ||
      a.pincode.includes(query.trim()),
  );

  const handleClose = () => dispatch(closeLocationSheet());

  const selectArea = (area: (typeof AREA_SUGGESTIONS)[0]) => {
    setDraft({
      ...area,
      addressLine: addressLine || `${area.shortLabel}, ${area.city}`,
    });
    setStep('confirm');
  };

  const useCurrentLocation = () => {
    setDraft({
      shortLabel: 'Current location',
      addressLine: 'Near you · detected area',
      city: 'Mumbai',
      pincode: '400001',
      lat: 19.076,
      lng: 72.8777,
    });
    setAddressLine('Flat / House no., Building, Street');
    setStep('confirm');
  };

  const confirmLocation = () => {
    const next: DeliveryLocation = {
      ...draft,
      addressLine: addressLine.trim() || draft.addressLine,
    };
    dispatch(setDeliveryLocation(next));
    dispatch(
      setDeliveryAddress(
        `${next.addressLine}, ${next.city} ${next.pincode}`,
      ),
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}>
      <View style={styles.root}>
        {/* Map preview (Blinkit-style pin map) */}
        <Pressable style={styles.mapArea} onPress={handleClose}>
          <LinearGradient
            colors={['#E8F5E9', '#D4EDDA', '#C8E6C9']}
            style={StyleSheet.absoluteFill}
          />
          {/* Fake roads */}
          <View style={[styles.road, styles.roadH1]} />
          <View style={[styles.road, styles.roadH2]} />
          <View style={[styles.road, styles.roadV1]} />
          <View style={[styles.road, styles.roadV2]} />
          <View style={styles.blockA} />
          <View style={styles.blockB} />
          <View style={styles.blockC} />

          <View style={styles.pinWrap} pointerEvents="none">
            <View style={styles.pinShadow} />
            <Icon name="map-marker" size={48} color={colors.purple} />
          </View>

          <TouchableOpacity style={[styles.mapClose, { top: insets.top + 8 }]} onPress={handleClose}>
            <Icon name="close" size={22} color={colors.text} />
          </TouchableOpacity>
        </Pressable>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetWrap}>
          <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
            <View style={styles.handle} />

            {step === 'search' ? (
              <>
                <Text style={styles.sheetTitle}>Select delivery location</Text>

                <View style={styles.searchRow}>
                  <Icon name="magnify" size={20} color={colors.purple} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search for area, street name..."
                    placeholderTextColor={colors.textMuted}
                    value={query}
                    onChangeText={setQuery}
                    autoFocus
                  />
                  {query ? (
                    <TouchableOpacity onPress={() => setQuery('')}>
                      <Icon name="close-circle" size={18} color={colors.textMuted} />
                    </TouchableOpacity>
                  ) : null}
                </View>

                <TouchableOpacity
                  style={styles.currentBtn}
                  activeOpacity={0.85}
                  onPress={useCurrentLocation}>
                  <View style={styles.currentIcon}>
                    <Icon name="crosshairs-gps" size={20} color={colors.purple} />
                  </View>
                  <View style={styles.currentText}>
                    <Text style={styles.currentTitle}>Use current location</Text>
                    <Text style={styles.currentSub}>Using GPS</Text>
                  </View>
                  <Icon name="chevron-right" size={20} color={colors.textMuted} />
                </TouchableOpacity>

                <Text style={styles.sectionLabel}>Saved addresses</Text>
                <ScrollView
                  style={styles.list}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}>
                  {saved.map(item => (
                    <TouchableOpacity
                      key={`${item.shortLabel}-${item.pincode}`}
                      style={styles.savedRow}
                      activeOpacity={0.85}
                      onPress={() => {
                        setDraft(item);
                        setAddressLine(item.addressLine);
                        setStep('confirm');
                      }}>
                      <View style={styles.savedIcon}>
                        <Icon name="home-outline" size={18} color={colors.purple} />
                      </View>
                      <View style={styles.savedText}>
                        <Text style={styles.savedTitle}>{item.shortLabel}</Text>
                        <Text style={styles.savedSub} numberOfLines={1}>
                          {item.addressLine}, {item.city} {item.pincode}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}

                  <Text style={[styles.sectionLabel, { marginTop: spacing.lg }]}>
                    Search results
                  </Text>
                  {filtered.map(item => (
                    <TouchableOpacity
                      key={item.pincode + item.shortLabel}
                      style={styles.savedRow}
                      activeOpacity={0.85}
                      onPress={() => selectArea(item)}>
                      <View style={styles.savedIcon}>
                        <Icon name="map-marker-outline" size={18} color={colors.purple} />
                      </View>
                      <View style={styles.savedText}>
                        <Text style={styles.savedTitle}>{item.shortLabel}</Text>
                        <Text style={styles.savedSub}>
                          {item.city} · {item.pincode}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.backRow}
                  onPress={() => setStep('search')}
                  activeOpacity={0.8}>
                  <Icon name="chevron-left" size={24} color={colors.text} />
                  <Text style={styles.backText}>Change location</Text>
                </TouchableOpacity>

                <View style={styles.confirmCard}>
                  <LinearGradient
                    colors={[colors.purpleLight, colors.white]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.confirmGradient}>
                    <Icon name="map-marker" size={28} color={colors.purple} />
                    <View style={styles.confirmInfo}>
                      <Text style={styles.confirmLabel}>{draft.shortLabel}</Text>
                      <Text style={styles.confirmMeta}>
                        {draft.city} · {draft.pincode}
                      </Text>
                    </View>
                  </LinearGradient>
                </View>

                <Text style={styles.fieldLabel}>Complete address</Text>
                <TextInput
                  style={styles.addressInput}
                  placeholder="House / Flat / Floor, Landmark"
                  placeholderTextColor={colors.textMuted}
                  value={addressLine}
                  onChangeText={setAddressLine}
                  multiline
                />

                <GradientButton
                  title="Confirm location"
                  onPress={confirmLocation}
                  fullWidth
                  style={styles.confirmBtn}
                />
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  mapArea: {
    ...StyleSheet.absoluteFillObject,
    bottom: SCREEN_H * 0.42,
  },
  road: {
    position: 'absolute',
    backgroundColor: colors.mapRoad,
    opacity: 0.9,
  },
  roadH1: { top: '38%', left: 0, right: 0, height: 10 },
  roadH2: { top: '62%', left: 0, right: 0, height: 8 },
  roadV1: { left: '32%', top: 0, bottom: 0, width: 10 },
  roadV2: { left: '68%', top: 0, bottom: 0, width: 8 },
  blockA: {
    position: 'absolute',
    top: '18%',
    left: '10%',
    width: 70,
    height: 55,
    borderRadius: 8,
    backgroundColor: 'rgba(155, 109, 255, 0.18)',
  },
  blockB: {
    position: 'absolute',
    top: '48%',
    left: '42%',
    width: 90,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(155, 109, 255, 0.12)',
  },
  blockC: {
    position: 'absolute',
    top: '72%',
    left: '55%',
    width: 60,
    height: 50,
    borderRadius: 8,
    backgroundColor: 'rgba(124, 92, 240, 0.15)',
  },
  pinWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinShadow: {
    position: 'absolute',
    width: 18,
    height: 8,
    borderRadius: 9,
    backgroundColor: 'rgba(0,0,0,0.2)',
    top: '52%',
  },
  mapClose: {
    position: 'absolute',
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  sheetWrap: {
    maxHeight: SCREEN_H * 0.62,
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    minHeight: SCREEN_H * 0.48,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  sheetTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
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
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 0,
  },
  currentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    marginBottom: spacing.md,
  },
  currentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.purpleLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  currentText: { flex: 1 },
  currentTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.purple,
  },
  currentSub: {
    ...typography.caption,
    textTransform: 'none',
    marginTop: 2,
  },
  sectionLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  list: {
    flexGrow: 0,
    maxHeight: SCREEN_H * 0.28,
  },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  savedIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.purpleLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  savedText: { flex: 1 },
  savedTitle: {
    ...typography.body,
    fontWeight: '600',
  },
  savedSub: {
    ...typography.caption,
    textTransform: 'none',
    marginTop: 2,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginLeft: -spacing.xs,
  },
  backText: {
    ...typography.body,
    fontWeight: '600',
  },
  confirmCard: {
    marginBottom: spacing.lg,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  confirmGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  confirmInfo: { flex: 1 },
  confirmLabel: {
    ...typography.h3,
  },
  confirmMeta: {
    ...typography.bodySmall,
    marginTop: 2,
  },
  fieldLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  addressInput: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    fontSize: 15,
    color: colors.text,
    textAlignVertical: 'top',
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
  },
  confirmBtn: {
    marginBottom: spacing.sm,
  },
});
