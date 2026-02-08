import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  Share,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useFinStore } from '../storage/bigFinCntxt';

const { width: bigFinWidth, height: bigFinHeight } = Dimensions.get('window');

const bigFinStorageKeys = {
  totalScore: 'flamingo_total_score',
  lastGameTime: 'flamingo_last_game_time',
};

const orangeGradient = ['#FE9200', '#FDEF70', '#FD3213'];

const bigFinCooldownMs = 4 * 60 * 60 * 1000;

export function BigFinTapGame() {
  const navigation = useNavigation();
  const { finSoundEnabled: bigFinSoundEnabled, setFinSoundEnabled } =
    useFinStore();

  const [bigFinMode, setBigFinMode] = useState('start');
  const [bigFinScore, setBigFinScore] = useState(0);
  const [bigFinSecondsLeft, setBigFinSecondsLeft] = useState(30);
  const [bigFinWallet, setBigFinWallet] = useState(0);

  const [bigFinDrops, setBigFinDrops] = useState([]);
  const [bigFinRunning, setBigFinRunning] = useState(false);
  const [bigFinPaused, setBigFinPaused] = useState(false);

  const [bigFinAvailable, setBigFinAvailable] = useState(true);
  const [bigFinCooldownLeftMs, setBigFinCooldownLeftMs] = useState(0);
  const [bigFinBooting, setBigFinBooting] = useState(true);

  const { height: h } = useWindowDimensions();
  const isSDevice = h < 700;
  const bigFinScoreRef = useRef(0);
  const bigFinDropIdRef = useRef(0);

  const bigFinTimerRef = useRef(null);
  const bigFinSpawnRef = useRef(null);
  const bigFinMoveRef = useRef(null);
  const bigFinCooldownRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      bigFinHydrate();
      bigFinLoadSound();
    }, []),
  );

  const bigFinLoadSound = async () => {
    try {
      const savedSoundVale = await AsyncStorage.getItem('toggleSound');

      const parsedJSON = JSON.parse(savedSoundVale);

      setFinSoundEnabled(parsedJSON);
    } catch (e) {
      console.error('play soun err', e);
    }
  };

  useEffect(() => {
    if (!bigFinAvailable) {
      bigFinCooldownRef.current = setInterval(() => {
        bigFinRecheckCooldown();
      }, 1000);
    }

    return () => {
      if (bigFinCooldownRef.current) clearInterval(bigFinCooldownRef.current);
    };
  }, [bigFinAvailable]);

  useEffect(() => {
    if (bigFinRunning && !bigFinPaused) {
      bigFinTimerRef.current = setInterval(() => {
        setBigFinSecondsLeft(prevSeconds => {
          if (prevSeconds <= 1) {
            bigFinEndRun();
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);

      bigFinSpawnRef.current = setInterval(() => {
        bigFinDropBubble();
      }, 800);

      bigFinMoveRef.current = setInterval(() => {
        setBigFinDrops(prevDrops =>
          prevDrops
            .map(drop => ({ ...drop, y: drop.y + 8 }))
            .filter(drop => drop.y < bigFinHeight + 100),
        );
      }, 30);
    }

    return () => {
      if (bigFinTimerRef.current) clearInterval(bigFinTimerRef.current);
      if (bigFinSpawnRef.current) clearInterval(bigFinSpawnRef.current);
      if (bigFinMoveRef.current) clearInterval(bigFinMoveRef.current);
    };
  }, [bigFinRunning, bigFinPaused]);

  const bigFinHydrate = async () => {
    try {
      const strdWallet = await AsyncStorage.getItem(
        bigFinStorageKeys.totalScore,
      );

      const savedLastTime = await AsyncStorage.getItem(
        bigFinStorageKeys.lastGameTime,
      );

      if (strdWallet) setBigFinWallet(parseInt(strdWallet, 10));

      if (savedLastTime) {
        const elapsed = Date.now() - parseInt(savedLastTime, 10);
        if (elapsed < bigFinCooldownMs) {
          setBigFinAvailable(false);
          setBigFinCooldownLeftMs(bigFinCooldownMs - elapsed);
        }
      }
    } catch (error) {
      console.warn('game loading error', error);
    } finally {
      setBigFinBooting(false);
    }
  };

  const bigFinRecheckCooldown = async () => {
    try {
      const lastTimeRaw = await AsyncStorage.getItem(
        bigFinStorageKeys.lastGameTime,
      );
      if (!lastTimeRaw) return;

      const finBigEll = Date.now() - parseInt(lastTimeRaw, 10);

      if (finBigEll >= bigFinCooldownMs) {
        setBigFinAvailable(true);
        setBigFinCooldownLeftMs(0);
        if (bigFinCooldownRef.current) clearInterval(bigFinCooldownRef.current);
      } else {
        setBigFinCooldownLeftMs(bigFinCooldownMs - finBigEll);
      }
    } catch (error) {
      console.log('Error checking cooldown:', error);
    }
  };

  const bigFinFormatCooldown = milisec => {
    const totalSeconds = Math.floor(milisec / 1000);

    const hours = Math.floor(totalSeconds / 3600);

    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const seconds = totalSeconds % 60;

    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const bigFinHasCollision = (fresh, existing) => {
    const minutesMar = 100;

    for (let item of existing) {
      const dist = Math.sqrt(
        Math.pow(fresh.x - item.x, 2) + Math.pow(fresh.y - item.y, 2),
      );
      if (dist < minutesMar) return true;
    }
    return false;
  };

  const bigFinDropBubble = () => {
    setBigFinDrops(prevDrops => {
      const isFlamingo = Math.random() > 0.4;
      const size = 70 + Math.random() * 10;

      const maxTries = 10;
      let tries = 0;
      let fresh;

      do {
        const x = Math.random() * (bigFinWidth - size - 40) + 20;
        const y = -size - Math.random() * 200;
        fresh = {
          id: bigFinDropIdRef.current,
          x,
          y,
          size,
          isFlamingo,
        };
        tries++;
      } while (bigFinHasCollision(fresh, prevDrops) && tries < maxTries);

      if (tries < maxTries) {
        bigFinDropIdRef.current += 1;
        return [...prevDrops, fresh];
      }

      return prevDrops;
    });
  };

  useEffect(() => {
    if (bigFinMode === 'start') {
      AsyncStorage.getItem(bigFinStorageKeys.totalScore).then(v => {
        setBigFinWallet(v ? Number(v) : 0);
      });
    }
  }, [bigFinMode]);

  const bigFinPopBubble = item => {
    if (item.isFlamingo) {
      bigFinScoreRef.current += 1;
      setBigFinScore(bigFinScoreRef.current);
    }
    setBigFinDrops(prevDrops => prevDrops.filter(b => b.id !== item.id));
  };

  const bigFinBeginRun = () => {
    if (!bigFinAvailable) return;

    setBigFinScore(0);
    bigFinScoreRef.current = 0;

    setBigFinSecondsLeft(30);

    setBigFinDrops([]);

    bigFinDropIdRef.current = 0;

    setBigFinRunning(true);

    setBigFinPaused(false);

    setBigFinMode('game');
  };

  const bigFinEndRun = async () => {
    setBigFinRunning(false);

    const earned = bigFinScoreRef.current;

    try {
      const storedWallet = await AsyncStorage.getItem(
        bigFinStorageKeys.totalScore,
      );
      const current = storedWallet ? Number(storedWallet) : 0;

      const nextTotal = current + earned;

      await AsyncStorage.setItem(
        bigFinStorageKeys.totalScore,
        String(nextTotal),
      );
      await AsyncStorage.setItem(
        bigFinStorageKeys.lastGameTime,
        String(Date.now()),
      );

      setBigFinWallet(nextTotal);

      setBigFinAvailable(false);
      setBigFinCooldownLeftMs(bigFinCooldownMs);
    } catch (e) {
      console.log('game save error:', e);
    }

    setBigFinMode('result');
  };

  const bigFinTogglePause = () => setBigFinPaused(p => !p);

  const bigFinFormatTimer = seconds => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const bigFinSetSound = async next => {
    try {
      await AsyncStorage.setItem('toggleSound', JSON.stringify(next));
      setFinSoundEnabled(next);
    } catch (e) {
      console.log('Error toggle sound', e);
    }
  };

  const bigFinShare = () => {
    Share.share({ message: `I just scored ${bigFinScore} points!` })
      .then(r => console.log(r))
      .catch(e => console.log(e));
  };

  // components

  if (bigFinBooting) {
    return (
      <ImageBackground
        source={require('../assets/finImages/levelsBg.png')}
        style={bigFinStyles.bigFinRoot}
      >
        <SafeAreaView style={bigFinStyles.bigFinSafe}>
          <View style={bigFinStyles.bigFinLoadingWrap}>
            <Text style={bigFinStyles.bigFinLoadingText}>Loading...</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (bigFinMode === 'start') {
    return (
      <ImageBackground
        source={require('../assets/finImages/levelsBg.png')}
        style={bigFinStyles.bigFinRoot}
      >
        <SafeAreaView style={bigFinStyles.bigFinSafe}>
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
                  onPress={() => navigation.goBack()}
                  style={bigFinStyles.bigFinBackBtn}
                >
                  <Image
                    source={require('../assets/finImages/bxs_up-arrow.png')}
                  />
                </TouchableOpacity>

                <Text
                  style={[
                    bigFinStyles.bigFinTitle,
                    isSDevice && { fontSize: 18 },
                  ]}
                >
                  Tap
                </Text>

                <Image
                  source={require('../assets/finImages/bottomStars.png')}
                  style={bigFinStyles.bigFinHeaderStars}
                />
              </View>
            </LinearGradient>
          </LinearGradient>

          <ImageBackground
            style={bigFinStyles.bigFinWalletBadge}
            source={require('../assets/finImages/topQ.png')}
          >
            <Text
              style={[
                bigFinStyles.bigFinWalletText,
                isSDevice && { fontSize: 16 },
              ]}
            >
              {bigFinWallet}
            </Text>
          </ImageBackground>

          <View style={bigFinStyles.bigFinCenter}>
            {bigFinAvailable ? (
              <>
                <Text style={bigFinStyles.bigFinHint}>
                  30 seconds. Show your tapping power!
                </Text>

                <TouchableOpacity onPress={bigFinBeginRun} activeOpacity={0.7}>
                  <LinearGradient
                    colors={['#3B43CB', '#944DD4', '#D058D0']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      bigFinStyles.bigFinPrimaryBtn,
                      isSDevice && { height: 60, width: 180 },
                    ]}
                  >
                    <Text
                      style={[
                        bigFinStyles.bigFinPrimaryBtnText,
                        isSDevice && { fontSize: 16 },
                      ]}
                    >
                      START
                    </Text>

                    <Image
                      source={require('../assets/finImages/buttonStars.png')}
                      style={{ position: 'absolute', right: 10, bottom: 5 }}
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={bigFinStyles.bigFinCooldownLabel}>
                  Next game available in:
                </Text>

                <LinearGradient
                  colors={[
                    'rgba(128, 90, 213, 0.6)',
                    'rgba(138, 43, 226, 0.5)',
                  ]}
                  style={bigFinStyles.bigFinPrimaryBtn}
                >
                  <Text style={bigFinStyles.bigFinCooldownText}>
                    {bigFinFormatCooldown(bigFinCooldownLeftMs)}
                  </Text>

                  <Image
                    source={require('../assets/finImages/buttonStars.png')}
                    style={{ position: 'absolute', right: 10, bottom: 5 }}
                  />
                </LinearGradient>
              </>
            )}
          </View>

          <View style={bigFinStyles.bigFinGlowDot} />
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (bigFinMode === 'game') {
    return (
      <ImageBackground
        source={require('../assets/finImages/levelsBg.png')}
        style={bigFinStyles.bigFinRoot}
      >
        <SafeAreaView style={bigFinStyles.bigFinSafe}>
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
                  onPress={() => navigation.goBack()}
                  style={bigFinStyles.bigFinBackBtn}
                >
                  <Image
                    source={require('../assets/finImages/bxs_up-arrow.png')}
                  />
                </TouchableOpacity>

                <Text style={bigFinStyles.bigFinTitle}>Tap</Text>

                <Image
                  source={require('../assets/finImages/bottomStars.png')}
                  style={bigFinStyles.bigFinHeaderStars}
                />
              </View>
            </LinearGradient>
          </LinearGradient>

          <View style={bigFinStyles.bigFinTopRow}>
            <View style={bigFinStyles.bigFinTimerBadge}>
              <Text style={bigFinStyles.bigFinTimerText}>
                {bigFinFormatTimer(bigFinSecondsLeft)}
              </Text>
            </View>

            <TouchableOpacity
              onPress={bigFinTogglePause}
              style={bigFinStyles.bigFinPauseBtn}
              activeOpacity={0.7}
            >
              <Image
                source={require('../assets/finImages/solar_pause-bold.png')}
              />
            </TouchableOpacity>
          </View>

          <View style={bigFinStyles.bigFinDropArea}>
            {bigFinDrops.map(item => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.7}
                onPress={() => bigFinPopBubble(item)}
                style={[
                  bigFinStyles.bigFinDropWrap,
                  {
                    left: item.x,
                    top: item.y,
                    width: item.size,
                    height: item.size,
                  },
                ]}
              >
                <Image
                  source={require('../assets/finImages/emptyBubble.png')}
                  style={bigFinStyles.bigFinBubbleBg}
                  resizeMode="contain"
                />
                {item.isFlamingo && (
                  <Image
                    source={require('../assets/finImages/flamingoBubble.png')}
                    style={bigFinStyles.bigFinBubbleFg}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {bigFinPaused && (
            <View style={bigFinStyles.bigFinPauseOverlay}>
              <LinearGradient
                colors={['#610EAC', '#C83DD7']}
                style={bigFinStyles.bigFinPauseCard}
              >
                <View style={{ padding: 15, alignItems: 'center' }}>
                  <TouchableOpacity
                    onPress={bigFinTogglePause}
                    activeOpacity={0.7}
                    style={bigFinStyles.bigFinPauseAction}
                  >
                    <Text style={bigFinStyles.bigFinPauseActionText}>
                      Continue
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={bigFinStyles.bigFinPauseAction}
                    activeOpacity={0.7}
                    onPress={() => {
                      setBigFinRunning(false);
                      setBigFinPaused(false);
                      navigation.goBack();
                    }}
                  >
                    <Text style={bigFinStyles.bigFinPauseActionText}>
                      Main Menu
                    </Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          )}
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (bigFinMode === 'result') {
    return (
      <ImageBackground
        source={require('../assets/finImages/doneBg.png')}
        style={bigFinStyles.bigFinRoot}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingVertical: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <SafeAreaView style={bigFinStyles.bigFinResultSafe}>
            <Image
              source={require('../assets/finImages/tapRes.png')}
              style={{ marginBottom: 14 }}
            />

            <Text style={bigFinStyles.bigFinResultLine}>You crushed it!</Text>
            <Text style={bigFinStyles.bigFinResultLine}>
              Your fingers were on fire
            </Text>
            <Text style={bigFinStyles.bigFinResultLine}>
              All those taps turned into Flamingo Points.
            </Text>

            <Text style={bigFinStyles.bigFinEarnedText}>
              Points earned: +{bigFinScore}
            </Text>
            <Text style={bigFinStyles.bigFinTotalText}>
              Total balance: {bigFinWallet}
            </Text>

            <View style={bigFinStyles.bigFinResultButtons}>
              <TouchableOpacity
                onPress={() => navigation.navigate('BigFinPartyZoneScreen')}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={orangeGradient}
                  style={bigFinStyles.bigFinResultBtn}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={bigFinStyles.bigFinResultBtnText}>
                    Party Zone
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7} onPress={bigFinShare}>
                <LinearGradient
                  colors={orangeGradient}
                  style={bigFinStyles.bigFinResultBtn}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={bigFinStyles.bigFinResultBtnText}>Share</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setBigFinMode('start')}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={orangeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={bigFinStyles.bigFinResultBtn}
                >
                  <Text style={bigFinStyles.bigFinResultBtnText}>Exit</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </ScrollView>
      </ImageBackground>
    );
  }

  return null;
}

const bigFinStyles = StyleSheet.create({
  bigFinRoot: { flex: 1 },
  bigFinSafe: { flex: 1 },

  bigFinLoadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigFinLoadingText: { color: '#fff', fontSize: 20, fontWeight: '600' },

  bigFinHeaderOuter: {
    marginTop: 60,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 16,
    marginBottom: 20,
    zIndex: 1,
  },

  bigFinHeaderInner: {
    padding: 12,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bigFinBackBtn: { position: 'absolute', left: 20 },

  bigFinTitle: { fontSize: 22, fontWeight: '900', color: '#FDEB57' },

  bigFinHeaderStars: {
    position: 'absolute',
    width: '100%',
    height: 60,
    zIndex: -1,
  },

  bigFinWalletBadge: {
    width: 132,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },

  bigFinWalletText: {
    color: '#FDEB57',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '900',
    left: 10,
  },

  bigFinCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  bigFinHint: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
    fontWeight: '500',
  },

  bigFinCooldownLabel: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },

  bigFinCooldownText: { color: '#FDEB57', fontSize: 24, fontWeight: '700' },

  bigFinPrimaryBtn: {
    width: 258,
    height: 71,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fff',
  },

  bigFinPrimaryBtnText: { color: '#FDEB57', fontSize: 24, fontWeight: '900' },

  bigFinGlowDot: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(128, 90, 213, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(252, 230, 253, 0.2)',
  },

  bigFinTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    zIndex: 1,
  },

  bigFinTimerBadge: {
    backgroundColor: '#1C0234',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#691D7A',
    minWidth: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bigFinTimerText: { color: '#FDEB57', fontSize: 22, fontWeight: '900' },

  bigFinPauseBtn: {
    backgroundColor: '#1C0234',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#691D7A',
  },

  bigFinDropArea: { flex: 1, position: 'relative' },

  bigFinDropWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bigFinBubbleBg: { width: '100%', height: '100%', position: 'absolute' },
  bigFinBubbleFg: { width: '60%', height: '60%' },

  bigFinPauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    zIndex: 2,
  },

  bigFinPauseCard: {
    width: '70%',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#F9CDF9',
    padding: 20,
  },

  bigFinPauseAction: {
    backgroundColor: 'rgba(16, 6, 61, 0.9)',
    width: '100%',
    height: 40,
    borderRadius: 50,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bigFinPauseActionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    fontStyle: 'italic',
  },

  bigFinSoundBtn: {
    marginTop: 16,
    backgroundColor: 'rgba(16, 6, 61, 0.9)',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bigFinResultSafe: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  bigFinResultLine: {
    fontSize: 16,
    color: '#FDE6D9',
    textAlign: 'center',
    marginVertical: 2,
    fontWeight: '500',
  },

  bigFinEarnedText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    marginTop: 30,
    marginBottom: 8,
  },

  bigFinTotalText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FDEB57',
    marginBottom: 40,
  },

  bigFinResultButtons: { gap: 12 },

  bigFinResultBtn: {
    borderRadius: 12,
    minWidth: 216,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bigFinResultBtnText: {
    color: '#10063D',
    fontSize: 18,
    fontWeight: '600',
    fontStyle: 'italic',
  },
});
