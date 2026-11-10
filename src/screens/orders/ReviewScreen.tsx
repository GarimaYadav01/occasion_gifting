import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { AppHeader } from '../../components/AppHeader';
import { Card, Chip, Field } from '../../components/Bits';
import { Img } from '../../components/Img';
import { Tap } from '../../components/Tap';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { BottomBar } from '../../components/BottomBar';
import { useToast } from '../../components/Toast';
import { productById } from '../../data/gifts';
import { eventTypeById } from '../../data/events';
import { useAppDispatch, useAppSelector } from '../../store';
import { reviewOrder } from '../../store/slices/orders';
import { useNav, useTheme } from '../../utils/hooks';
import { RootStackParamList } from '../../navigation/types';

const LABELS = ['', 'Terrible', 'Bad', 'Okay', 'Good', 'Loved it!'];
const TAGS = { gift: ['Fresh & beautiful', 'On-time delivery', 'Great packaging', 'Value for money', 'Polite delivery partner'], event: ['Punctual setup', 'Creative décor', 'Delicious food', 'Great coordination', 'Value for money'] };

export const ReviewScreen = () => {
  const { c } = useTheme();
  const nav = useNav();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const { kind, id } = useRoute<RouteProp<RootStackParamList, 'Review'>>().params;
  const gift = useAppSelector(s => s.orders.gifts.find(g => g.id === id));
  const booking = useAppSelector(s => s.orders.bookings.find(b => b.id === id));
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [text, setText] = useState('');
  const image = kind === 'gift' ? productById(gift!.items[0].productId).image : eventTypeById(booking!.eventType)!.image;
  const title = kind === 'gift' ? productById(gift!.items[0].productId).name : eventTypeById(booking!.eventType)!.name;

  const submit = () => {
    dispatch(reviewOrder({ kind, id, rating, text: [tags.join(' · '), text].filter(Boolean).join('\n') }));
    toast.show('Thanks for your feedback! 💜', 'heart');
    nav.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <AppHeader title="Rate & review" subtitle={`#${id}`} />
      <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <Card style={{ alignItems: 'center', paddingVertical: 24 }}>
          <Img uri={image} style={{ width: 90, height: 90, borderRadius: 20 }} />
          <Text style={{ fontWeight: '900', fontSize: 17, color: c.text, marginTop: 12, textAlign: 'center' }}>{title}</Text>
          <Text style={{ color: c.sub, marginTop: 4 }}>How was your experience?</Text>
          <View style={{ flexDirection: 'row', marginTop: 16, gap: 6 }}>
            {[1, 2, 3, 4, 5].map(i => (
              <Tap key={i} scale={0.8} onPress={() => setRating(i)}><Icon name={i <= rating ? 'star' : 'star-outline'} size={42} color={i <= rating ? c.gold : c.line} /></Tap>
            ))}
          </View>
          <Text style={{ fontWeight: '900', color: rating ? c.ink : c.muted, marginTop: 8, fontSize: 15 }}>{rating ? LABELS[rating] : 'Tap to rate'}</Text>
        </Card>
        {rating > 0 && (
          <>
            <Text style={{ fontWeight: '900', color: c.text, fontSize: 15, marginTop: 20, marginBottom: 10 }}>What did you like?</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {TAGS[kind].map(t => <Chip key={t} label={t} on={tags.includes(t)} icon={tags.includes(t) ? 'check' : undefined} style={{ marginRight: 0 }} onPress={() => setTags(l => (l.includes(t) ? l.filter(x => x !== t) : [...l, t]))} />)}
            </View>
            <Field label="Write a review (optional)" placeholder="Share details to help others choose…" value={text} onChangeText={setText} multiline style={{ marginTop: 18 }} />
            <Tap style={{ flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 1.2, borderStyle: 'dashed', borderColor: c.ink, justifyContent: 'center' }} onPress={() => toast.show('Photo picker coming soon', 'camera')}>
              <Icon name="camera-plus-outline" size={20} color={c.ink} />
              <Text style={{ color: c.ink, fontWeight: '800', marginLeft: 6 }}>Add photos</Text>
            </Tap>
          </>
        )}
      </ScrollView>
      <BottomBar><Button title="Submit review" disabled={!rating} onPress={submit} /></BottomBar>
    </View>
  );
};
