import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { Card, Chip, Field, InfoBanner } from '../../components/Bits';
import { Img } from '../../components/Img';
import { Tap } from '../../components/Tap';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { BottomBar } from '../../components/BottomBar';
import { Calendar } from '../../components/Calendar';
import { EmptyState } from '../../components/States';
import { useToast } from '../../components/Toast';
import { useAppDispatch, useAppSelector } from '../../store';
import { addReminder, deleteReminder } from '../../store/slices/profile';
import { useNav, useTheme } from '../../utils/hooks';
import { daysUntilYearly, monthName } from '../../utils/format';
import { Reminder } from '../../data/user';

export const RemindersScreen = () => {
  const { c } = useTheme();
  const nav = useNav();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const list = useAppSelector(s => [...s.profile.reminders].sort((a, b) => daysUntilYearly(a.date) - daysUntilYearly(b.date)));
  const [filter, setFilter] = useState('All');
  const shown = list.filter(r => filter === 'All' || r.type === filter);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <AppHeader title="Occasion reminders" subtitle="Never miss a special day" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <InfoBanner icon="bell-ring-outline" tone="info" text="We'll remind you 7 days and 1 day before, with gift ideas and midnight delivery options." />
        <View style={{ flexDirection: 'row', marginVertical: 14 }}>
          {['All', 'Birthday', 'Anniversary', 'Other'].map(f => <Chip key={f} label={f} on={filter === f} onPress={() => setFilter(f)} />)}
        </View>
        {shown.length === 0 ? (
          <EmptyState icon="calendar-heart" title="No reminders yet" body="Add birthdays and anniversaries of your loved ones." cta="Add reminder" onCta={() => nav.navigate('AddReminder')} />
        ) : shown.map(r => {
          const days = daysUntilYearly(r.date);
          const [, m, d] = r.date.split('-').map(Number);
          return (
            <Card key={r.id} style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {r.avatar ? <Img uri={r.avatar} style={styles.avatar} /> : (
                  <View style={[styles.avatar, { backgroundColor: c.tint, alignItems: 'center', justifyContent: 'center' }]}><Text style={{ fontWeight: '900', color: c.ink, fontSize: 18 }}>{r.name[0]}</Text></View>
                )}
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ fontWeight: '900', color: c.text, fontSize: 15 }}>{r.name}</Text>
                  <Text style={{ color: c.sub, fontSize: 12, marginTop: 2 }}>{r.relation} · {r.type} · {d} {monthName(m - 1)}</Text>
                </View>
                <View style={[styles.days, { backgroundColor: days <= 7 ? c.accentSoft : c.lineSoft }]}>
                  <Text style={{ fontWeight: '900', fontSize: 18, color: days <= 7 ? c.accent : c.text }}>{days === 0 ? '🎉' : days}</Text>
                  <Text style={{ fontSize: 9, fontWeight: '800', color: days <= 7 ? c.accent : c.sub }}>{days === 0 ? 'TODAY' : 'DAYS'}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                <Button title="Send gift" icon="gift-outline" size="sm" style={{ flex: 1 }} onPress={() => nav.navigate('ProductList', { occasion: r.type === 'Anniversary' ? 'anniversary' : 'birthday', title: `Gifts for ${r.name.split(' ')[0]}` })} />
                <Button title="Plan party" icon="party-popper" size="sm" variant="soft" style={{ flex: 1 }} onPress={() => nav.navigate('BookEventType', { eventType: r.type === 'Anniversary' ? 'anniversary' : 'birthday' })} />
                <Tap onPress={() => { dispatch(deleteReminder(r.id)); toast.show('Reminder removed', 'bell-off'); }} style={[styles.del, { borderColor: c.line }]}><Icon name="trash-can-outline" size={18} color={c.danger} /></Tap>
              </View>
            </Card>
          );
        })}
      </ScrollView>
      <BottomBar><Button title="Add birthday or anniversary" icon="plus" onPress={() => nav.navigate('AddReminder')} /></BottomBar>
    </View>
  );
};

export const AddReminderScreen = () => {
  const { c } = useTheme();
  const nav = useNav();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Friend');
  const [type, setType] = useState<Reminder['type']>('Birthday');
  const [date, setDate] = useState<string | undefined>();
  const [err, setErr] = useState('');
  const save = () => {
    if (name.trim().length < 2) { setErr('Please enter a name'); return; }
    if (!date) { setErr('Please pick a date'); return; }
    dispatch(addReminder({ id: 'r' + Date.now(), name: name.trim(), relation, type, date: date.slice(0, 10) }));
    toast.show('Reminder added 🎂', 'bell-check');
    nav.goBack();
  };
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppHeader title="Add reminder" />
      <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Occasion</Text>
        <View style={{ flexDirection: 'row', marginBottom: 14 }}>
          {([['Birthday', 'cake-variant'], ['Anniversary', 'heart'], ['Other', 'star']] as const).map(([t, i]) => <Chip key={t} label={t} icon={i} on={type === t} onPress={() => setType(t)} />)}
        </View>
        <Field label="Their name" icon="account-outline" placeholder="e.g. Neha Sharma" value={name} onChangeText={x => { setName(x); setErr(''); }} />
        <Text style={styles.label}>Relationship</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
          {['Friend', 'Mother', 'Father', 'Partner', 'Sibling', 'Colleague', 'Parents'].map(r => <Chip key={r} label={r} on={relation === r} onPress={() => setRelation(r)} />)}
        </ScrollView>
        <Text style={styles.label}>Date</Text>
        <Card><Calendar value={date} onChange={iso => { setDate(iso); setErr(''); }} /></Card>
        {err ? <Text style={{ color: c.danger, fontWeight: '700', marginTop: 10 }}>{err}</Text> : null}
      </ScrollView>
      <BottomBar><Button title="Save reminder" onPress={save} /></BottomBar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  avatar: { width: 50, height: 50, borderRadius: 25 },
  days: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  del: { width: 34, height: 34, borderRadius: 9, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 13, fontWeight: '700', color: '#6B6275', marginBottom: 8 },
});
