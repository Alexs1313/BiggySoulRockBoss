import React, { useCallback, useMemo, useState } from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { stories as bigFinStories } from '../data/soulStories';

const bigFinBackground = require('../assets/finImages/gameBg.png');

const bigFinStorageKeys = {
  unlockedStoriesCount: 'stories_unlocked_count',
};

const bigFinSafeNumber = number => (Number.isFinite(number) ? number : 0);

export default function BigFinStoriesScreen() {
  const navigation = useNavigation();

  const { height: h } = useWindowDimensions();
  const isSDevice = h < 700;

  const [bigFinUnlockedCount, setBigFinUnlockedCount] = useState(0);
  const [bigFinActiveIndex, setBigFinActiveIndex] = useState(0);

  const bigFinReadUnlockedCount = useCallback(async () => {
    try {
      const storiesCount = await AsyncStorage.getItem(
        bigFinStorageKeys.unlockedStoriesCount,
      );
      const parsed = storiesCount ? parseInt(storiesCount, 10) : 0;

      return bigFinSafeNumber(parsed);
    } catch (e) {
      console.log('stories error', e);
      return 0;
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const getSavedCount = async () => {
        const count = await bigFinReadUnlockedCount();
        setBigFinUnlockedCount(count);
        setBigFinActiveIndex(0);
      };
      getSavedCount();
    }, [bigFinReadUnlockedCount]),
  );

  const bigFinAvailableStories = useMemo(
    () => bigFinStories.slice(0, bigFinUnlockedCount),
    [bigFinUnlockedCount],
  );

  const bigFinHasStories = bigFinAvailableStories.length > 0;
  const bigFinActiveStory = bigFinHasStories
    ? bigFinAvailableStories[bigFinActiveIndex]
    : null;

  const bigFinHasNext = bigFinAvailableStories.length > 1;

  const bigFinGoBack = () => navigation.goBack();

  const bigFinGoNext = () => {
    if (!bigFinHasStories) return;
    setBigFinActiveIndex(prev => (prev + 1) % bigFinAvailableStories.length);
  };

  const bigFinShare = async () => {
    if (!bigFinActiveStory) return;

    const sharedInfo =
      `Story: ${bigFinActiveStory.title}\n` +
      `${bigFinActiveStory.story}\n` +
      `Message: ${bigFinActiveStory.message}`;

    await Share.share({ message: sharedInfo });
  };

  const BigFinContent = () => {
    if (!bigFinHasStories) {
      return (
        <View style={bigFinStyles.bigFinEmptyWrap}>
          <Text style={bigFinStyles.bigFinEmptyText}>
            You have no stories available.
          </Text>
        </View>
      );
    }

    return (
      <View
        style={[bigFinStyles.bigFinCard, isSDevice ? { padding: 12 } : null]}
      >
        <Text
          style={[
            bigFinStyles.bigFinLabel,
            isSDevice ? { fontSize: 18 } : { fontSize: 20 },
          ]}
        >
          Story:
        </Text>
        <Text
          style={[
            bigFinStyles.bigFinBody,
            isSDevice ? { fontSize: 16 } : { fontSize: 20 },
          ]}
        >
          {bigFinActiveStory.story}
        </Text>

        <Text style={[bigFinStyles.bigFinLabel, bigFinStyles.bigFinLabelGap]}>
          Message:
        </Text>
        <Text
          style={[
            bigFinStyles.bigFinBody,
            isSDevice ? { fontSize: 16 } : { fontSize: 20 },
          ]}
        >
          {bigFinActiveStory.message}
        </Text>

        <Image
          source={bigFinActiveStory.img}
          style={[
            bigFinStyles.bigFinStoryImg,
            isSDevice
              ? { height: 150, width: 150 }
              : { height: 200, width: 200 },
          ]}
          resizeMode="contain"
        />
      </View>
    );
  };

  const BigFinHeader = () => (
    <LinearGradient
      colors={['#B8D0FF', '#E9B3FF', '#DC35F4']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={bigFinStyles.bigFinHeaderOuter}
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
        <View style={bigFinStyles.bigFinHeaderInner}>
          <TouchableOpacity
            onPress={bigFinGoBack}
            style={bigFinStyles.bigFinBackBtn}
          >
            <Image source={require('../assets/finImages/bxs_up-arrow.png')} />
          </TouchableOpacity>

          <Text
            style={[
              bigFinStyles.bigFinHeaderTitle,
              isSDevice ? { fontSize: 18 } : { fontSize: 22 },
            ]}
          >
            Ocean Diaries
          </Text>

          <Image
            source={require('../assets/finImages/bottomStars.png')}
            style={bigFinStyles.bigFinHeaderStars}
          />
        </View>
      </LinearGradient>
    </LinearGradient>
  );

  const BigFinActions = () => {
    if (!bigFinHasStories) return null;

    return (
      <View style={bigFinStyles.bigFinActionsRow}>
        <TouchableOpacity onPress={bigFinShare} activeOpacity={0.7}>
          <LinearGradient
            colors={['#DE78E9', '#3D2498']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={bigFinStyles.bigFinActionBtn}
          >
            <Text style={bigFinStyles.bigFinActionText}>Share</Text>
          </LinearGradient>
        </TouchableOpacity>

        {bigFinHasNext && (
          <TouchableOpacity onPress={bigFinGoNext} activeOpacity={0.7}>
            <LinearGradient
              colors={['#DE78E9', '#3D2498']}
              style={bigFinStyles.bigFinActionBtn}
            >
              <Text style={bigFinStyles.bigFinActionText}>Next</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <ImageBackground
      source={bigFinBackground}
      style={bigFinStyles.bigFinmainBox}
      resizeMode="cover"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: Platform.OS === 'android' ? h * 0.07 : 0,
          paddingBottom: 20,
        }}
      >
        <SafeAreaView style={bigFinStyles.bigFinSafe}>
          <BigFinHeader />
          <BigFinContent />
          <BigFinActions />
        </SafeAreaView>
      </ScrollView>
    </ImageBackground>
  );
}

const bigFinStyles = StyleSheet.create({
  bigFinmainBox: { flex: 1 },

  bigFinSafe: { flex: 1, padding: 16 },

  bigFinHeaderStars: {
    position: 'absolute',
    width: '100%',
    height: 60,
    zIndex: -1,
  },

  bigFinHeaderOuter: {
    marginTop: 12,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 16,
    marginBottom: 20,
  },

  bigFinHeaderInner: {
    padding: 12,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bigFinBackBtn: { position: 'absolute', left: 20 },

  bigFinHeaderTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FDEB57',
  },

  bigFinCard: {
    width: '90%',
    borderRadius: 18,
    backgroundColor: '#f282f0ff',
    padding: 9,
    paddingVertical: 19,
    borderWidth: 3,
    borderColor: '#f7f7f7ff',
    alignSelf: 'center',
  },

  bigFinLabel: {
    fontSize: 20,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 6,
  },

  bigFinLabelGap: { marginTop: 12 },

  bigFinBody: { fontSize: 20, fontWeight: '500', color: '#fff' },

  bigFinStoryImg: { alignSelf: 'flex-end' },

  bigFinActionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 12,
  },

  bigFinActionBtn: {
    width: 136,
    height: 44,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bigFinActionText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  bigFinEmptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  bigFinEmptyText: { color: '#fff', fontSize: 16 },
});
