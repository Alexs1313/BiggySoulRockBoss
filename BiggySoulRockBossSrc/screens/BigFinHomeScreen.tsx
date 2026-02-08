import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Sound from 'react-native-sound';
import { useFinStore } from '../storage/bigFinCntxt';
import LinearGradient from 'react-native-linear-gradient';

const biggySoulSafeNumber = (n: number) => (Number.isFinite(n) ? n : 0);

const biggySoulTrackList = [
  '679359__vannipat__melody-loop-mix-128-bpm.mp3',
  '679359__vannipat__melody-loop-mix-128-bpm.mp3',
];

const biggySoulAsyncStorageKeys = {
  soundKey: 'toggleSound',
  totalScoreKey: 'flamingo_total_score',
};

const BigFinHomeScreen = () => {
  const navigationBiggySoul = useNavigation<any>();

  const { height: heightBiggySoul } = useWindowDimensions();
  const isSmallDeviceBiggySoul = heightBiggySoul < 700;

  const [biggySoulTrackIndex, setBiggySoulTrackIndex] = useState<number>(0);
  const [biggySoulSound, setBiggySoulSound] = useState<Sound | null>(null);

  const {
    finSoundEnabled: biggySoulSoundEnabled,
    setFinSoundEnabled: setBiggySoulSoundEnabled,
  } = useFinStore();

  const [biggySoulTotalScore, setBiggySoulTotalScore] = useState<number>(0);

  useFocusEffect(
    useCallback(() => {
      biggySoulLoadSoundToggle();
      biggySoulLoadTotalScore();
    }, []),
  );

  useEffect(() => {
    biggySoulPlayMusic(biggySoulTrackIndex);

    return () => {
      if (biggySoulSound) {
        biggySoulSound.stop(() => {
          biggySoulSound.release();
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [biggySoulTrackIndex]);

  const biggySoulLoadTotalScore = useCallback(async () => {
    try {
      const rawBiggySoul = await AsyncStorage.getItem(
        biggySoulAsyncStorageKeys.totalScoreKey,
      );
      const parsedBiggySoul = rawBiggySoul ? parseInt(rawBiggySoul, 10) : 0;
      setBiggySoulTotalScore(biggySoulSafeNumber(parsedBiggySoul));
    } catch (errorBiggySoul) {
      console.log('loadTotalScore error:', errorBiggySoul);
      setBiggySoulTotalScore(0);
    }
  }, []);

  const biggySoulPlayMusic = (trackIndexBiggySoul: number) => {
    if (biggySoulSound) {
      biggySoulSound.stop(() => {
        biggySoulSound.release();
      });
    }

    const trackNameBiggySoul = biggySoulTrackList[trackIndexBiggySoul];

    const nextSoundBiggySoul = new Sound(
      trackNameBiggySoul,
      Sound.MAIN_BUNDLE,
      errorBiggySoul => {
        if (errorBiggySoul) {
          console.log('Error', errorBiggySoul);
          return;
        }

        nextSoundBiggySoul.play(successBiggySoul => {
          if (successBiggySoul) {
            setBiggySoulTrackIndex(
              prevBiggySoul => (prevBiggySoul + 1) % biggySoulTrackList.length,
            );
          } else {
            console.log('Error');
          }
        });

        setBiggySoulSound(nextSoundBiggySoul);
      },
    );
  };

  useEffect(() => {
    const biggySoulSyncToggleFromStorage = async () => {
      try {
        const rawBiggySoul = await AsyncStorage.getItem(
          biggySoulAsyncStorageKeys.soundKey,
        );
        const enabledBiggySoul = rawBiggySoul
          ? JSON.parse(rawBiggySoul)
          : false;

        setBiggySoulSoundEnabled(enabledBiggySoul);
        if (biggySoulSound) biggySoulSound.setVolume(enabledBiggySoul ? 1 : 0);
      } catch (errorBiggySoul) {
        console.error('mus error', errorBiggySoul);
      }
    };

    biggySoulSyncToggleFromStorage();
  }, [biggySoulSound, setBiggySoulSoundEnabled]);

  useEffect(() => {
    if (biggySoulSound) biggySoulSound.setVolume(biggySoulSoundEnabled ? 1 : 0);
  }, [biggySoulSoundEnabled, biggySoulSound]);

  const biggySoulLoadSoundToggle = async () => {
    try {
      const rawBiggySoul = await AsyncStorage.getItem(
        biggySoulAsyncStorageKeys.soundKey,
      );
      const enabledBiggySoul = rawBiggySoul ? JSON.parse(rawBiggySoul) : false;
      setBiggySoulSoundEnabled(enabledBiggySoul);
    } catch (errorBiggySoul) {
      console.error('mus error', errorBiggySoul);
    }
  };

  const biggySoulToggleSound = async (nextEnabledBiggySoul: boolean) => {
    try {
      await AsyncStorage.setItem(
        biggySoulAsyncStorageKeys.soundKey,
        JSON.stringify(nextEnabledBiggySoul),
      );
      setBiggySoulSoundEnabled(nextEnabledBiggySoul);
    } catch (errorBiggySoul) {
      console.log('sound failed', errorBiggySoul);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/finImages/levelsBg.png')}
      style={biggySoulRoot}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={biggySoulScroll}
      >
        <View style={[biggySoulScreen, { paddingTop: heightBiggySoul * 0.1 }]}>
          <ImageBackground
            style={biggySoulScoreBadge}
            source={require('../assets/finImages/topQ.png')}
          >
            <Text
              style={[
                biggySoulScoreText,
                isSmallDeviceBiggySoul ? { fontSize: 16 } : { fontSize: 20 },
              ]}
            >
              {biggySoulTotalScore}
            </Text>
          </ImageBackground>

          <View style={biggySoulMenuWrap}>
            <Image
              source={require('../assets/finImages/menuFrame.png')}
              style={biggySoulMenuFrame}
            />

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                navigationBiggySoul.navigate('BigFinCriticLevelsScreen')
              }
            >
              <LinearGradient
                colors={['#B8D0FF', '#E9B3FF', '#DC35F4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={biggySoulHeaderOuter}
              >
                <LinearGradient
                  colors={['#3B43CB', '#944DD4', '#D058D0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    biggySoulHeaderBorder,
                    { padding: Platform.OS === 'ios' ? 2 : 0 },
                  ]}
                >
                  <View style={biggySoulHeaderInner}>
                    <Text
                      style={[
                        biggySoulHeaderTitle,
                        isSmallDeviceBiggySoul
                          ? { fontSize: 20 }
                          : { fontSize: 24 },
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
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                navigationBiggySoul.navigate('BigFinPartyZoneScreen')
              }
            >
              <LinearGradient
                colors={['#B8D0FF', '#E9B3FF', '#DC35F4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={biggySoulHeaderOuter}
              >
                <LinearGradient
                  colors={['#3B43CB', '#944DD4', '#D058D0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    biggySoulHeaderBorder,
                    { padding: Platform.OS === 'ios' ? 2 : 0 },
                  ]}
                >
                  <View style={biggySoulHeaderInner}>
                    <Text
                      style={[
                        biggySoulHeaderTitle,
                        isSmallDeviceBiggySoul
                          ? { fontSize: 20 }
                          : { fontSize: 24 },
                      ]}
                    >
                      Party Zone
                    </Text>

                    <Image
                      source={require('../assets/finImages/bottomStars.png')}
                      style={biggySoulHeaderStars}
                    />
                  </View>
                </LinearGradient>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigationBiggySoul.navigate('BigFinTapGame')}
            >
              <LinearGradient
                colors={['#B8D0FF', '#E9B3FF', '#DC35F4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={biggySoulHeaderOuter}
              >
                <LinearGradient
                  colors={['#3B43CB', '#944DD4', '#D058D0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    biggySoulHeaderBorder,
                    { padding: Platform.OS === 'ios' ? 2 : 0 },
                  ]}
                >
                  <View style={biggySoulHeaderInner}>
                    <Text
                      style={[
                        biggySoulHeaderTitle,
                        isSmallDeviceBiggySoul
                          ? { fontSize: 20 }
                          : { fontSize: 24 },
                      ]}
                    >
                      Tap Game
                    </Text>

                    <Image
                      source={require('../assets/finImages/bottomStars.png')}
                      style={biggySoulHeaderStars}
                    />
                  </View>
                </LinearGradient>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                navigationBiggySoul.navigate('BigFinStoriesScreen')
              }
            >
              <LinearGradient
                colors={['#B8D0FF', '#E9B3FF', '#DC35F4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={biggySoulHeaderOuter}
              >
                <LinearGradient
                  colors={['#3B43CB', '#944DD4', '#D058D0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    biggySoulHeaderBorder,
                    { padding: Platform.OS === 'ios' ? 2 : 0 },
                  ]}
                >
                  <View style={biggySoulHeaderInner}>
                    <Text
                      style={[
                        biggySoulHeaderTitle,
                        isSmallDeviceBiggySoul
                          ? { fontSize: 20 }
                          : { fontSize: 24 },
                      ]}
                    >
                      Ocean Diaries
                    </Text>

                    <Image
                      source={require('../assets/finImages/bottomStars.png')}
                      style={biggySoulHeaderStars}
                    />
                  </View>
                </LinearGradient>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={biggySoulSoundButton}
              activeOpacity={0.7}
              onPress={() => biggySoulToggleSound(!biggySoulSoundEnabled)}
            >
              <Image
                source={
                  biggySoulSoundEnabled
                    ? require('../assets/finImages/musBtn.png')
                    : require('../assets/finImages/musicOff.png')
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const biggySoulRoot = { flex: 1 };

const biggySoulScroll = { flexGrow: 1 };

const biggySoulScreen = {
  flex: 1,
  alignItems: 'center' as const,
  paddingBottom: 30,
};

const biggySoulScoreBadge = {
  width: 132,
  height: 34,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};

const biggySoulScoreText = {
  color: '#FDEB57',
  fontSize: 20,
  textAlign: 'center' as const,
  fontWeight: '900' as const,
  left: 10,
};

const biggySoulMenuWrap = {
  flex: 1,
  justifyContent: 'center' as const,
  marginTop: 20,
  gap: 6,
  width: '80%',
};

const biggySoulMenuFrame = { alignSelf: 'center' as const };

const biggySoulHeaderOuter = {
  marginTop: 12,
  width: '90%',
  alignSelf: 'center' as const,
  borderRadius: 16,
  marginBottom: 3,
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

const biggySoulSoundButton = {
  zIndex: 1,
  marginTop: 20,
  alignSelf: 'center' as const,
};

export default BigFinHomeScreen;
