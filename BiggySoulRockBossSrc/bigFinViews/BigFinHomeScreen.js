import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Sound from 'react-native-sound';
import { useFinStore } from '../storage/bigFinCntxt';
import LinearGradient from 'react-native-linear-gradient';

const bigFinSafeNumber = n => (Number.isFinite(n) ? n : 0);

const bigFinTrackList = [
  '679359__vannipat__melody-loop-mix-128-bpm.mp3',
  '679359__vannipat__melody-loop-mix-128-bpm.mp3',
];

const asyncStorageKeys = {
  soundKey: 'toggleSound',
  totalScoreKey: 'flamingo_total_score',
};

const BigFinHomeScreen = () => {
  const navigation = useNavigation();

  const { width: w, height: h } = useWindowDimensions();
  const isSDevice = h < 700;

  const [bigFinTrackIndex, setBigFinTrackIndex] = useState(0);
  const [bigFinSound, setBigFinSound] = useState(null);

  const { finSoundEnabled: bigFinSoundEnabled, setFinSoundEnabled } =
    useFinStore();

  const [bigFinTotalScore, setBigFinTotalScore] = useState(0);

  useFocusEffect(
    useCallback(() => {
      bigFinLoadSoundToggle();
      bigFinLoadTotalScore();
    }, []),
  );

  useEffect(() => {
    bigFinPlayMusic(bigFinTrackIndex);

    return () => {
      if (bigFinSound) {
        bigFinSound.stop(() => {
          bigFinSound.release();
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bigFinTrackIndex]);

  const bigFinLoadTotalScore = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(asyncStorageKeys.totalScoreKey);
      const parsed = raw ? parseInt(raw, 10) : 0;
      setBigFinTotalScore(bigFinSafeNumber(parsed));
    } catch (e) {
      console.log('loadTotalScore error:', e);
      setBigFinTotalScore(0);
    }
  }, []);

  const bigFinPlayMusic = trackIndex => {
    if (bigFinSound) {
      bigFinSound.stop(() => {
        bigFinSound.release();
      });
    }

    const trackName = bigFinTrackList[trackIndex];

    const nextSound = new Sound(trackName, Sound.MAIN_BUNDLE, err => {
      if (err) {
        console.log('Error', err);
        return;
      }

      nextSound.play(success => {
        if (success) {
          setBigFinTrackIndex(prev => (prev + 1) % bigFinTrackList.length);
        } else {
          console.log('Error');
        }
      });

      setBigFinSound(nextSound);
    });
  };

  useEffect(() => {
    const syncToggleFromStorage = async () => {
      try {
        const raw = await AsyncStorage.getItem(asyncStorageKeys.soundKey);
        const enabled = JSON.parse(raw);
        setFinSoundEnabled(enabled);
        if (bigFinSound) bigFinSound.setVolume(enabled ? 1 : 0);
      } catch (e) {
        console.error('mus error', e);
      }
    };

    syncToggleFromStorage();
  }, [bigFinSound, setFinSoundEnabled]);

  useEffect(() => {
    if (bigFinSound) bigFinSound.setVolume(bigFinSoundEnabled ? 1 : 0);
  }, [bigFinSoundEnabled, bigFinSound]);

  const bigFinLoadSoundToggle = async () => {
    try {
      const raw = await AsyncStorage.getItem(asyncStorageKeys.soundKey);
      const enabled = JSON.parse(raw);
      setFinSoundEnabled(enabled);
    } catch (e) {
      console.error('mus error', e);
    }
  };

  const bigFinToggleSound = async nextEnabled => {
    try {
      await AsyncStorage.setItem(
        asyncStorageKeys.soundKey,
        JSON.stringify(nextEnabled),
      );
      setFinSoundEnabled(nextEnabled);
    } catch (e) {
      console.log('sound failed', e);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/finImages/levelsBg.png')}
      style={bigFinStyles.bigFinRoot}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={[bigFinStyles.bigFinScreen, { paddingTop: h * 0.1 }]}>
          <ImageBackground
            style={bigFinStyles.bigFinScoreBadge}
            source={require('../assets/finImages/topQ.png')}
          >
            <Text
              style={[
                bigFinStyles.bigFinScoreText,
                isSDevice ? { fontSize: 16 } : { fontSize: 20 },
              ]}
            >
              {bigFinTotalScore}
            </Text>
          </ImageBackground>

          <View style={bigFinStyles.bigFinMenuWrap}>
            <Image
              source={require('../assets/finImages/menuFrame.png')}
              style={{ alignSelf: 'center' }}
            />

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('BigFinCriticLevelsScreen')}
            >
              <LinearGradient
                colors={['#B8D0FF', '#E9B3FF', '#DC35F4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={bigFinStyles.bigFinHeaderOuter}
              >
                <LinearGradient
                  colors={['#3B43CB', '#944DD4', '#D058D0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    padding: Platform.OS === 'ios' ? 2 : 0,
                    borderRadius: 16,
                    width: '100%',
                  }}
                >
                  <View style={bigFinStyles.bigFinHeaderInner}>
                    <Text
                      style={[
                        bigFinStyles.bigFinHeaderTitle,
                        isSDevice ? { fontSize: 20 } : { fontSize: 24 },
                      ]}
                    >
                      Inner Critic Test
                    </Text>

                    <Image
                      source={require('../assets/finImages/bottomStars.png')}
                      style={bigFinStyles.bigFinHeaderStars}
                    />
                  </View>
                </LinearGradient>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('BigFinCriticLevelsScreen')}
            >
              <LinearGradient
                colors={['#B8D0FF', '#E9B3FF', '#DC35F4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={bigFinStyles.bigFinHeaderOuter}
              >
                <LinearGradient
                  colors={['#3B43CB', '#944DD4', '#D058D0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    padding: Platform.OS === 'ios' ? 2 : 0,
                    borderRadius: 16,
                    width: '100%',
                  }}
                >
                  <View style={bigFinStyles.bigFinHeaderInner}>
                    <Text
                      style={[
                        bigFinStyles.bigFinHeaderTitle,
                        isSDevice ? { fontSize: 20 } : { fontSize: 24 },
                      ]}
                    >
                      Party Zone
                    </Text>

                    <Image
                      source={require('../assets/finImages/bottomStars.png')}
                      style={bigFinStyles.bigFinHeaderStars}
                    />
                  </View>
                </LinearGradient>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('BigFinTapGame')}
            >
              <LinearGradient
                colors={['#B8D0FF', '#E9B3FF', '#DC35F4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={bigFinStyles.bigFinHeaderOuter}
              >
                <LinearGradient
                  colors={['#3B43CB', '#944DD4', '#D058D0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    padding: Platform.OS === 'ios' ? 2 : 0,
                    borderRadius: 16,
                    width: '100%',
                  }}
                >
                  <View style={bigFinStyles.bigFinHeaderInner}>
                    <Text
                      style={[
                        bigFinStyles.bigFinHeaderTitle,
                        isSDevice ? { fontSize: 20 } : { fontSize: 24 },
                      ]}
                    >
                      Tap Game
                    </Text>

                    <Image
                      source={require('../assets/finImages/bottomStars.png')}
                      style={bigFinStyles.bigFinHeaderStars}
                    />
                  </View>
                </LinearGradient>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('BigFinStoriesScreen')}
            >
              <LinearGradient
                colors={['#B8D0FF', '#E9B3FF', '#DC35F4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={bigFinStyles.bigFinHeaderOuter}
              >
                <LinearGradient
                  colors={['#3B43CB', '#944DD4', '#D058D0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    padding: Platform.OS === 'ios' ? 2 : 0,
                    borderRadius: 16,
                    width: '100%',
                  }}
                >
                  <View style={bigFinStyles.bigFinHeaderInner}>
                    <Text
                      style={[
                        bigFinStyles.bigFinHeaderTitle,
                        isSDevice ? { fontSize: 20 } : { fontSize: 24 },
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
            </TouchableOpacity>

            <TouchableOpacity
              style={bigFinStyles.bigFinSoundButton}
              activeOpacity={0.7}
              onPress={() => bigFinToggleSound(!bigFinSoundEnabled)}
            >
              <Image
                source={
                  bigFinSoundEnabled
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

const bigFinStyles = StyleSheet.create({
  bigFinRoot: { flex: 1 },

  bigFinScreen: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 30,
  },

  bigFinScoreBadge: {
    width: 132,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bigFinHeaderOuter: {
    marginTop: 12,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 16,
    marginBottom: 3,
  },

  bigFinHeaderInner: {
    padding: 12,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bigFinBackBtn: { position: 'absolute', left: 20 },

  bigFinHeaderTitle: { fontSize: 22, fontWeight: '900', color: '#FDEB57' },

  bigFinHeaderStars: {
    position: 'absolute',
    width: '100%',
    height: 60,
    zIndex: -1,
  },
  bigFinScoreText: {
    color: '#FDEB57',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '900',
    left: 10,
  },

  bigFinMenuWrap: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 20,
    gap: 6,
    width: '80%',
  },

  bigFinSoundButton: {
    zIndex: 1,
    marginTop: 20,
    alignSelf: 'center',
  },
});

export default BigFinHomeScreen;
