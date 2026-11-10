import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from './Icon';
import { Button } from './Button';
import { Img } from './Img';
import { useTheme } from '../utils/hooks';
import { font } from '../theme';

interface Props {
  icon?: string;
  image?: string;
  title: string;
  body?: string;
  cta?: string;
  onCta?: () => void;
  compact?: boolean;
}

export const EmptyState = ({ icon = 'gift-open-outline', image, title, body, cta, onCta, compact }: Props) => {
  const { c } = useTheme();
  return (
    <View style={[styles.wrap, compact && { paddingVertical: 30 }]}>
      {image ? (
        <Img uri={image} style={styles.image} />
      ) : (
        <View style={[styles.circle, { backgroundColor: c.tint }]}>
          <View style={[styles.circleIn, { backgroundColor: c.white }]}><Icon name={icon} size={44} color={c.ink} /></View>
        </View>
      )}
      <Text style={[font.h1, { color: c.text, textAlign: 'center', marginTop: 18 }]}>{title}</Text>
      {body ? <Text style={[font.body, { color: c.sub, textAlign: 'center', marginTop: 6, maxWidth: 290 }]}>{body}</Text> : null}
      {cta ? <Button title={cta} onPress={onCta} style={{ marginTop: 22, minWidth: 200 }} size="md" /> : null}
    </View>
  );
};

export const ErrorState = ({ title = 'Something went wrong', body = 'We could not load this right now. Please check your connection and try again.', onRetry }: { title?: string; body?: string; onRetry?: () => void }) => {
  const { c } = useTheme();
  return (
    <View style={styles.wrap}>
      <View style={[styles.circle, { backgroundColor: c.dangerSoft }]}>
        <View style={[styles.circleIn, { backgroundColor: c.white }]}><Icon name="wifi-off" size={42} color={c.danger} /></View>
      </View>
      <Text style={[font.h1, { color: c.text, textAlign: 'center', marginTop: 18 }]}>{title}</Text>
      <Text style={[font.body, { color: c.sub, textAlign: 'center', marginTop: 6, maxWidth: 290 }]}>{body}</Text>
      {onRetry ? <Button title="Try again" icon="refresh" variant="outline" onPress={onRetry} style={{ marginTop: 22, minWidth: 180 }} size="md" /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 24 },
  circle: { width: 132, height: 132, borderRadius: 66, alignItems: 'center', justifyContent: 'center' },
  circleIn: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  image: { width: 180, height: 140, borderRadius: 20 },
});
