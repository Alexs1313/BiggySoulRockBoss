import React, { useCallback, useState } from 'react';
import {
  Image,
  ImageBackground as CustomBackgroundBiggySoul,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

const biggySoulLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const biggySoulAsyncStorageKeys = {
  criticMaxLevel: 'critic_max_level',
};

const biggySoulSafeNumber = (n: number) => (Number.isFinite(n) ? n : 0);

export default function BigFinCriticLevelsScreen() {
  const navigationBiggySoul = useNavigation<any>();

  const { height: heightBiggySoul } = useWindowDimensions();
  const isSmallDeviceBiggySoul = heightBiggySoul < 700;

  const [biggySoulMaxCompletedLevel, setBiggySoulMaxCompletedLevel] =
    useState<number>(0);

  const biggySoulLoadProgress = useCallback(async () => {
    try {
      const rawBiggySoul = await AsyncStorage.getItem(
        biggySoulAsyncStorageKeys.criticMaxLevel,
      );
      const parsedBiggySoul = rawBiggySoul ? parseInt(rawBiggySoul, 10) : 0;
      setBiggySoulMaxCompletedLevel(biggySoulSafeNumber(parsedBiggySoul));
    } catch (errorBiggySoul) {
      console.log('critic level read error', errorBiggySoul);
      setBiggySoulMaxCompletedLevel(0);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      biggySoulLoadProgress();
    }, [biggySoulLoadProgress]),
  );

  const biggySoulNextLevel = Math.min(
    Math.max(1, biggySoulMaxCompletedLevel + 1),
    biggySoulLevels.length,
  );

  const biggySoulGetLevelMode = (levelBiggySoul: number) => {
    if (levelBiggySoul <= biggySoulMaxCompletedLevel) return 'completed';
    if (levelBiggySoul === biggySoulNextLevel) return 'next';
    return 'locked';
  };

  const biggySoulGetModeStyle = (modeBiggySoul: string) => {
    switch (modeBiggySoul) {
      case 'completed':
        return biggySoulLevelCompleted;
      case 'next':
        return biggySoulLevelNext;
      default:
        return biggySoulLevelLocked;
    }
  };

  return (
    <CustomBackgroundBiggySoul
      source={require('../assets/finImages/levelsBg.png')}
      style={biggySoulRoot}
      resizeMode="cover"
      bgBlurRadius={10}
    >
      <ScrollView
        contentContainerStyle={[
          biggySoulScrollContent,
          {
            paddingTop: Platform.OS === 'android' ? heightBiggySoul * 0.07 : 0,
          },
        ]}
      >
        <SafeAreaView style={biggySoulSafeArea}>
          <LinearGradient
            colors={['#B8D0FF', '#E9B3FF', '#DC35F4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={biggySoulHeaderOuter}
          >
            <LinearGradient
              colors={['#3B43CB', '#944DD4', '#D058D0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                biggySoulHeaderBorder,
                { padding: Platform.OS === 'ios' ? 2 : 0 },
              ]}
            >
              <View style={biggySoulHeaderInner}>
                <TouchableOpacity
                  onPress={() => navigationBiggySoul.goBack()}
                  style={biggySoulBackBtn}
                >
                  <Image
                    source={require('../assets/finImages/bxs_up-arrow.png')}
                  />
                </TouchableOpacity>

                <Text
                  style={[
                    biggySoulHeaderTitle,
                    isSmallDeviceBiggySoul
                      ? { fontSize: 18 }
                      : { fontSize: 22 },
                  ]}
                >
                  Inner Critic Test
                </Text>

                <Image
                  source={require('../assets/finImages/bottomStars.png')}
                  style={biggySoulHeaderStars}
                />
              </View>
            </LinearGradient>
          </LinearGradient>

          <View style={[biggySoulGrid, { marginTop: heightBiggySoul * 0.11 }]}>
            {biggySoulLevels.map(levelBiggySoul => {
              const modeBiggySoul = biggySoulGetLevelMode(levelBiggySoul);
              const disabledBiggySoul = modeBiggySoul === 'locked';

              return (
                <TouchableOpacity
                  key={levelBiggySoul}
                  activeOpacity={0.85}
                  disabled={disabledBiggySoul}
                  onPress={() =>
                    navigationBiggySoul.navigate('BigFinCriticTestScreen', {
                      level: levelBiggySoul,
                    })
                  }
                  style={biggySoulCardTouchable}
                >
                  <LinearGradient
                    colors={['#FCE6FD', '#7F38FA']}
                    style={biggySoulCardOuter}
                  >
                    <View
                      style={[
                        biggySoulCardInner,
                        isSmallDeviceBiggySoul
                          ? { width: 60, height: 75 }
                          : { width: 73, height: 90 },
                        biggySoulGetModeStyle(modeBiggySoul),
                      ]}
                    >
                      <Text style={biggySoulLevelText}>{levelBiggySoul}</Text>
                      <Image source={require('../assets/finImages/star.png')} />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>

          <View
            style={[biggySoulStartWrap, { marginTop: heightBiggySoul * 0.04 }]}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() =>
                navigationBiggySoul.navigate('BigFinCriticTestScreen', {
                  level: biggySoulNextLevel,
                })
              }
            >
              <LinearGradient
                colors={['#FE9200', '#FDEF70', '#FD3213']}
                style={[
                  biggySoulStartBtn,
                  isSmallDeviceBiggySoul
                    ? { height: 50, width: 196 }
                    : { height: 60, width: 216 },
                ]}
              >
                <Text
                  style={[
                    biggySoulStartText,
                    isSmallDeviceBiggySoul
                      ? { fontSize: 16 }
                      : { fontSize: 18 },
                  ]}
                >
                  {`START LEVEL ${biggySoulNextLevel}`}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
    </CustomBackgroundBiggySoul>
  );
}

const biggySoulRoot = { flex: 1 };

const biggySoulScrollContent = { flexGrow: 1 };

const biggySoulSafeArea = { flex: 1 };

const biggySoulHeaderOuter = {
  marginTop: 12,
  width: '90%',
  alignSelf: 'center' as const,
  borderRadius: 16,
  marginBottom: 20,
};

const biggySoulHeaderBorder = {
  borderRadius: 16,
  width: '100%',
};

const biggySoulHeaderInner = {
  padding: 12,
  paddingVertical: 20,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

const biggySoulBackBtn = { position: 'absolute' as const, left: 20 };

const biggySoulHeaderTitle = {
  fontSize: 22,
  fontWeight: '900' as const,
  color: '#FDEB57',
};

const biggySoulHeaderStars = {
  position: 'absolute' as const,
  width: '100%',
  height: 60,
  zIndex: -1,
};

const biggySoulGrid = {
  flexDirection: 'row' as const,
  flexWrap: 'wrap' as const,
  justifyContent: 'center' as const,
  gap: 20,
  width: '90%',
  alignSelf: 'center' as const,
};

const biggySoulCardTouchable = { borderRadius: 10 };

const biggySoulCardOuter = { borderRadius: 10 };

const biggySoulCardInner = {
  width: 73,
  height: 90,
  borderRadius: 8,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  margin: 3,
};

const biggySoulLevelLocked = { backgroundColor: '#0345eeff' };
const biggySoulLevelCompleted = { backgroundColor: '#AE491D' };
const biggySoulLevelNext = { backgroundColor: '#6a0abfff' };

const biggySoulLevelText = {
  fontSize: 28,
  fontWeight: '900' as const,
  color: '#fff',
};

const biggySoulStartWrap = { marginTop: 30 };

const biggySoulStartBtn = {
  width: 216,
  height: 60,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  borderRadius: 12,
  alignSelf: 'center' as const,
};

const biggySoulStartText = {
  color: '#10063D',
  fontSize: 18,
  fontWeight: '700' as const,
  fontStyle: 'italic' as const,
};
