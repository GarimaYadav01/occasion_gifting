import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OrderStatus } from '../../types';
import { colors, spacing, typography } from '../../theme';

const steps: { status: OrderStatus; label: string }[] = [
  { status: 'placed', label: 'Order Placed' },
  { status: 'confirmed', label: 'Confirmed' },
  { status: 'preparing', label: 'Preparing' },
  { status: 'out-for-delivery', label: 'Out for Delivery' },
  { status: 'delivered', label: 'Delivered' },
];

const statusOrder: OrderStatus[] = steps.map(s => s.status);

interface OrderStatusTimelineProps {
  currentStatus: OrderStatus;
}

export const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({
  currentStatus,
}) => {
  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isActive = index === currentIndex;

        return (
          <View key={step.status} style={styles.step}>
            <View style={styles.stepLeft}>
              <View
                style={[
                  styles.dot,
                  isCompleted && styles.dotCompleted,
                  isActive && styles.dotActive,
                ]}>
                {isCompleted ? (
                  <Text style={styles.check}>✓</Text>
                ) : null}
              </View>
              {index < steps.length - 1 ? (
                <View
                  style={[
                    styles.line,
                    index < currentIndex && styles.lineCompleted,
                  ]}
                />
              ) : null}
            </View>
            <View style={styles.stepContent}>
              <Text
                style={[
                  styles.label,
                  isCompleted && styles.labelCompleted,
                  isActive && styles.labelActive,
                ]}>
                {step.label}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
  },
  step: {
    flexDirection: 'row',
    minHeight: 48,
  },
  stepLeft: {
    alignItems: 'center',
    width: 32,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCompleted: {
    backgroundColor: colors.purple,
  },
  dotActive: {
    backgroundColor: colors.purple,
    borderWidth: 3,
    borderColor: colors.purpleLight,
  },
  check: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginVertical: 2,
  },
  lineCompleted: {
    backgroundColor: colors.purpleSoft,
  },
  stepContent: {
    flex: 1,
    paddingLeft: spacing.md,
    paddingBottom: spacing.lg,
  },
  label: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  labelCompleted: {
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.purple,
    fontWeight: '600',
  },
});
