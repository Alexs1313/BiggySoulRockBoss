import React, { useCallback, useState } from 'react';
import {
  Image,
  ImageBackground as CustomBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

const bigFinLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const asyncStorageKeys = {
  criticMaxLevel: 'critic_max_level',
};

const bigFinSafeNumber = n => (Number.isFinite(n) ? n : 0);

export default function BigFinCriticLevelsScreen() {
  const navigation = useNavigation();

  const { height: h } = useWindowDimensions();
  const isSDevice = h < 700;

  const [bigFinMaxCompletedLevel, setBigFinMaxCompletedLevel] = useState(0);

  const bigFinLoadProgress = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(asyncStorageKeys.criticMaxLevel);
      const parsed = raw ? parseInt(raw, 10) : 0;
      setBigFinMaxCompletedLevel(bigFinSafeNumber(parsed));
    } catch (e) {
      console.log('critic level read error', e);
      setBigFinMaxCompletedLevel(0);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      bigFinLoadProgress();
    }, [bigFinLoadProgress]),
  );

  const bigFinNextLevel = Math.min(
    Math.max(1, bigFinMaxCompletedLevel + 1),
    bigFinLevels.length,
  );

  const bigFinGetLevelMode = lvlselected => {
    if (lvlselected <= bigFinMaxCompletedLevel) return 'completed';

    if (lvlselected === bigFinNextLevel) return 'next';

    return 'locked';
  };

  const bigFinGetModeStyle = modeSt => {
    switch (modeSt) {
      case 'completed':
        return bigFinStyles.bigFinLevelCompleted;
      case 'next':
        return bigFinStyles.bigFinLevelNext;
      default:
        return bigFinStyles.bigFinLevelLocked;
    }
  };

  return (
    <CustomBackground
      source={require('../assets/finImages/levelsBg.png')}
      style={bigFinStyles.bigFinRoot}
      resizeMode="cover"
      bgBlurRadius={10}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: Platform.OS === 'android' ? h * 0.07 : 0,
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
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
                    bigFinStyles.bigFinHeaderTitle,
                    isSDevice ? { fontSize: 18 } : { fontSize: 22 },
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

          <View style={[bigFinStyles.bigFinGrid, { marginTop: h * 0.11 }]}>
            {bigFinLevels.map(level => {
              const mode = bigFinGetLevelMode(level);
              const disabled = mode === 'locked';

              return (
                <TouchableOpacity
                  key={level}
                  activeOpacity={0.85}
                  disabled={disabled}
                  onPress={() =>
                    navigation.navigate('BigFinCriticTestScreen', { level })
                  }
                  style={{ borderRadius: 10 }}
                >
                  <LinearGradient
                    colors={['#FCE6FD', '#7F38FA']}
                    style={bigFinStyles.bigFinCardOuter}
                  >
                    <View
                      style={[
                        bigFinStyles.bigFinCardInner,
                        isSDevice
                          ? { width: 60, height: 75 }
                          : { width: 73, height: 90 },
                        bigFinGetModeStyle(mode),
                      ]}
                    >
                      <Text style={bigFinStyles.bigFinLevelText}>{level}</Text>
                      <Image source={require('../assets/finImages/star.png')} />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={[bigFinStyles.bigFinStartWrap, { marginTop: h * 0.04 }]}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('BigFinCriticTestScreen', {
                  level: bigFinNextLevel,
                })
              }
            >
              <LinearGradient
                colors={['#FE9200', '#FDEF70', '#FD3213']}
                style={[
                  bigFinStyles.bigFinStartBtn,
                  isSDevice
                    ? { height: 50, width: 196 }
                    : { height: 60, width: 216 },
                ]}
              >
                <Text
                  style={[
                    bigFinStyles.bigFinStartText,
                    isSDevice ? { fontSize: 16 } : { fontSize: 18 },
                  ]}
                >
                  {`START LEVEL ${bigFinNextLevel}`}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
    </CustomBackground>
  );
}

const bigFinStyles = StyleSheet.create({
  bigFinRoot: { flex: 1 },

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

  bigFinHeaderTitle: { fontSize: 22, fontWeight: '900', color: '#FDEB57' },

  bigFinHeaderStars: {
    position: 'absolute',
    width: '100%',
    height: 60,
    zIndex: -1,
  },

  bigFinGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    width: '90%',
    alignSelf: 'center',
  },

  bigFinCardOuter: { borderRadius: 10 },

  bigFinCardInner: {
    width: 73,
    height: 90,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3,
  },

  bigFinLevelLocked: { backgroundColor: '#0345eeff' },
  bigFinLevelCompleted: { backgroundColor: '#AE491D' },
  bigFinLevelNext: { backgroundColor: '#6a0abfff' },

  bigFinLevelText: { fontSize: 28, fontWeight: '900', color: '#fff' },

  bigFinStartWrap: { marginTop: 30 },

  bigFinStartBtn: {
    width: 216,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    alignSelf: 'center',
  },

  bigFinStartText: {
    color: '#10063D',
    fontSize: 18,
    fontWeight: '700',
    fontStyle: 'italic',
  },
});
