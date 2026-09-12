import React from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { giftCategories } from '../../data/mockData';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/layout/Header';
import { CategoryGrid } from '../../components/home/CategoryGrid';
import { spacing } from '../../theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'Categories'>;

export const CategoriesScreen: React.FC<Props> = ({ navigation }) => (
  <ScreenContainer scroll={false} contentStyle={styles.content}>
    <Header
      title="Categories"
      subtitle="Browse all gift types"
      showBack
      onBack={() => navigation.goBack()}
    />
    <FlatList
      data={[giftCategories]}
      keyExtractor={() => 'grid'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
      renderItem={() => (
        <CategoryGrid
          categories={giftCategories}
          onPress={category =>
            navigation.navigate('ProductListing', {
              categoryId: category.id,
              title: category.name,
            })
          }
        />
      )}
    />
  </ScreenContainer>
);

const styles = StyleSheet.create({
  content: { flex: 1 },
  list: { paddingBottom: spacing.huge },
});
