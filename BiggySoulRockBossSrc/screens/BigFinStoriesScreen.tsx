import React, { useCallback, useMemo, useState } from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { stories as biggySoulStories } from '../data/soulStories';

const biggySoulBackground = require('../assets/finImages/gameBg.png');

const biggySoulStorageKeys = {
  unlockedStoriesCount: 'stories_unlocked_count',
};

const biggySoulSafeNumber = (number: any) =>
  Number.isFinite(number) ? number : 0;

export default function BigFinStoriesScreen() {
  const navigationBiggySoul = useNavigation<any>();

  const { height: biggySoulH } = useWindowDimensions();
  const biggySoulIsSmallDevice = biggySoulH < 700;

  const [biggySoulUnlockedCount, setBiggySoulUnlockedCount] = useState(0);
  const [biggySoulActiveIndex, setBiggySoulActiveIndex] = useState(0);

  const biggySoulReadUnlockedCount = useCallback(async () => {
    try {
      const storiesCount = await AsyncStorage.getItem(
        biggySoulStorageKeys.unlockedStoriesCount,
      );
      const parsed = storiesCount ? parseInt(storiesCount, 10) : 0;
      return biggySoulSafeNumber(parsed);
    } catch (e) {
      console.log('stories error', e);
      return 0;
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const getSavedCount = async () => {
        const count = await biggySoulReadUnlockedCount();
        setBiggySoulUnlockedCount(count);
        setBiggySoulActiveIndex(0);
      };
      getSavedCount();
    }, [biggySoulReadUnlockedCount]),
  );

  const biggySoulAvailableStories = useMemo(
    () => biggySoulStories.slice(0, biggySoulUnlockedCount),
    [biggySoulUnlockedCount],
  );

  const biggySoulHasStories = biggySoulAvailableStories.length > 0;
  const biggySoulActiveStory = biggySoulHasStories
    ? biggySoulAvailableStories[biggySoulActiveIndex]
    : null;

  const biggySoulHasNext = biggySoulAvailableStories.length > 1;

  const biggySoulGoBack = () => navigationBiggySoul.goBack();

  const biggySoulGoNext = () => {
    if (!biggySoulHasStories) return;
    setBiggySoulActiveIndex(
      prev => (prev + 1) % biggySoulAvailableStories.length,
    );
  };

  const biggySoulShare = async () => {
    if (!biggySoulActiveStory) return;

    const sharedInfo =
      `Story: ${biggySoulActiveStory.title}\n` +
      `${biggySoulActiveStory.story}\n` +
      `Message: ${biggySoulActiveStory.message}`;

    await Share.share({ message: sharedInfo });
  };

  const BiggySoulContent = () => {
    if (!biggySoulHasStories) {
      return (
        <View style={biggySoulStyles.emptyWrap}>
          <Text style={biggySoulStyles.emptyText}>
            You have no stories available.
          </Text>
        </View>
      );
    }

    return (
      <View
        style={[
          biggySoulStyles.card,
          biggySoulIsSmallDevice ? { padding: 12 } : null,
        ]}
      >
        <Text
          style={[
            biggySoulStyles.label,
            biggySoulIsSmallDevice ? { fontSize: 18 } : { fontSize: 20 },
          ]}
        >
          Story:
        </Text>

        <Text
          style={[
            biggySoulStyles.body,
            biggySoulIsSmallDevice ? { fontSize: 16 } : { fontSize: 20 },
          ]}
        >
          {biggySoulActiveStory?.story}
        </Text>

        <Text style={[biggySoulStyles.label, biggySoulStyles.labelGap]}>
          Message:
        </Text>

        <Text
          style={[
            biggySoulStyles.body,
            biggySoulIsSmallDevice ? { fontSize: 16 } : { fontSize: 20 },
          ]}
        >
          {biggySoulActiveStory?.message}
        </Text>

        {biggySoulActiveStory?.img ? (
          <Image
            source={biggySoulActiveStory.img}
            style={[
              biggySoulStyles.storyImg,
              biggySoulIsSmallDevice
                ? { height: 150, width: 150 }
                : { height: 200, width: 200 },
            ]}
            resizeMode="contain"
          />
        ) : null}
      </View>
    );
  };

  const BiggySoulHeader = () => (
    <LinearGradient
      colors={['#B8D0FF', '#E9B3FF', '#DC35F4']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={biggySoulStyles.headerOuter}
    >
      <LinearGradient
        colors={['#3B43CB', '#944DD4', '#D058D0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          padding: Platform.OS === 'ios' ? 2 : 0,
          borderRadius: 16,
          width: '100%',
        }}
      >
        <View style={biggySoulStyles.headerInner}>
          <TouchableOpacity
            onPress={biggySoulGoBack}
            style={biggySoulStyles.backBtn}
          >
            <Image source={require('../assets/finImages/bxs_up-arrow.png')} />
          </TouchableOpacity>

          <Text
            style={[
              biggySoulStyles.headerTitle,
              biggySoulIsSmallDevice ? { fontSize: 18 } : { fontSize: 22 },
            ]}
          >
            Ocean Diaries
          </Text>

          <Image
            source={require('../assets/finImages/bottomStars.png')}
            style={biggySoulStyles.headerStars}
          />
        </View>
      </LinearGradient>
    </LinearGradient>
  );

  const BiggySoulActions = () => {
    if (!biggySoulHasStories) return null;

    return (
      <View style={biggySoulStyles.actionsRow}>
        <TouchableOpacity onPress={biggySoulShare} activeOpacity={0.7}>
          <LinearGradient
            colors={['#DE78E9', '#3D2498']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={biggySoulStyles.actionBtn}
          >
            <Text style={biggySoulStyles.actionText}>Share</Text>
          </LinearGradient>
        </TouchableOpacity>

        {biggySoulHasNext && (
          <TouchableOpacity onPress={biggySoulGoNext} activeOpacity={0.7}>
            <LinearGradient
              colors={['#DE78E9', '#3D2498']}
              style={biggySoulStyles.actionBtn}
            >
              <Text style={biggySoulStyles.actionText}>Next</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <ImageBackground
      source={biggySoulBackground}
      style={biggySoulStyles.mainBox}
      resizeMode="cover"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: Platform.OS === 'android' ? biggySoulH * 0.06 : 0,
          paddingBottom: 20,
        }}
      >
        <SafeAreaView style={biggySoulStyles.safe}>
          <BiggySoulHeader />
          <BiggySoulContent />
          <BiggySoulActions />
        </SafeAreaView>
      </ScrollView>
    </ImageBackground>
  );
}

const biggySoulStyles = {
  mainBox: { flex: 1 },

  safe: { flex: 1 },

  headerStars: {
    position: 'absolute' as const,
    width: '100%' as const,
    height: 60,
    zIndex: -1 as const,
  },

  headerOuter: {
    width: '90%' as const,
    alignSelf: 'center' as const,
    borderRadius: 16,
    marginBottom: 20,
  },

  headerInner: {
    padding: 12,
    paddingVertical: 20,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  backBtn: { position: 'absolute' as const, left: 20 },

  headerTitle: {
    fontSize: 22,
    fontWeight: '900' as const,
    color: '#FDEB57',
  },

  card: {
    width: '90%' as const,
    borderRadius: 18,
    backgroundColor: '#f282f0ff',
    padding: 9,
    paddingVertical: 19,
    borderWidth: 3,
    borderColor: '#f7f7f7ff',
    alignSelf: 'center' as const,
  },

  label: {
    fontSize: 20,
    fontWeight: '500' as const,
    color: '#fff',
    marginBottom: 6,
  },

  labelGap: { marginTop: 12 },

  body: { fontSize: 20, fontWeight: '500' as const, color: '#fff' },

  storyImg: { alignSelf: 'flex-end' as const },

  actionsRow: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    gap: 20,
    marginTop: 12,
  },

  actionBtn: {
    width: 136,
    height: 44,
    borderRadius: 50,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  actionText: { color: '#fff', fontSize: 16, fontWeight: '700' as const },

  emptyWrap: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  emptyText: { color: '#fff', fontSize: 16 },
} as const;
