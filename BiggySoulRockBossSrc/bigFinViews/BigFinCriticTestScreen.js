import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { quizQuestions as bigFinQuizQuestions } from '../data/quizQuestions';

const asyncKeys = {
  criticMaxLevel: 'critic_max_level',
  partyFishUnlocked: 'party_fish_unlocked',
};

const asyncStoryKeys = {
  storiesUnlockedCount: 'stories_unlocked_count',
  storyMaxLevel: 'story_max_level',
};

const bigFinSafeNumber = n => (Number.isFinite(n) ? n : 0);

export function BigFinCriticTestScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const rawLevel = Number(route?.params?.level || 1);
  const bigFinLevel = Math.max(1, Math.min(6, bigFinSafeNumber(rawLevel)));

  const [bigFinActiveLevel, setBigFinActiveLevel] = useState(bigFinLevel);
  const [bigFinQuestionIndex, setBigFinQuestionIndex] = useState(0);
  const [bigFinPickedIndex, setBigFinPickedIndex] = useState(null);
  const [bigFinPhase, setBigFinPhase] = useState('quiz');
  const { height: h } = useWindowDimensions();
  const isSDevice = h < 700;

  useEffect(() => {
    setBigFinActiveLevel(bigFinLevel);
    setBigFinQuestionIndex(0);
    setBigFinPickedIndex(null);
    setBigFinPhase('quiz');
  }, [bigFinLevel]);

  const bigFinLevelPack = useMemo(
    () => bigFinQuizQuestions[bigFinActiveLevel],
    [bigFinActiveLevel],
  );

  const bigFinCurrentCard = bigFinLevelPack?.[bigFinQuestionIndex];

  const bigFinSaveLevelRewards = async doneLevel => {
    try {
      const maxRaw = await AsyncStorage.getItem(asyncKeys.criticMaxLevel);
      const maxSaved = maxRaw ? parseInt(maxRaw, 10) : 0;
      const newMax = Math.max(maxSaved, doneLevel);
      await AsyncStorage.setItem(asyncKeys.criticMaxLevel, String(newMax));

      const shouldUnlockFish = Math.min(7, doneLevel + 1);
      const fishRaw = await AsyncStorage.getItem(asyncKeys.partyFishUnlocked);
      const fishSaved = fishRaw ? parseInt(fishRaw, 10) : 1;
      const fishNew = Math.max(fishSaved, shouldUnlockFish);
      await AsyncStorage.setItem(asyncKeys.partyFishUnlocked, String(fishNew));

      const storyMaxRaw = await AsyncStorage.getItem(
        asyncStoryKeys.storyMaxLevel,
      );
      const storyMaxSaved = storyMaxRaw ? parseInt(storyMaxRaw, 10) : 0;

      if (doneLevel > storyMaxSaved) {
        const countRaw = await AsyncStorage.getItem(
          asyncStoryKeys.storiesUnlockedCount,
        );
        const countSaved = countRaw ? parseInt(countRaw, 10) : 0;
        const countNew = Math.min(6, countSaved + 1);

        await AsyncStorage.setItem(
          asyncStoryKeys.storiesUnlockedCount,
          String(countNew),
        );
        await AsyncStorage.setItem(
          asyncStoryKeys.storyMaxLevel,
          String(doneLevel),
        );
      }
    } catch (e) {
      console.log('save Rewards fail', e);
    }
  };

  useEffect(() => {
    if (bigFinPhase === 'done') bigFinSaveLevelRewards(bigFinActiveLevel);
  }, [bigFinPhase, bigFinActiveLevel]);

  const bigFinRestartToLevel = nextLevel => {
    setBigFinActiveLevel(nextLevel);
    setBigFinQuestionIndex(0);
    setBigFinPickedIndex(null);
    setBigFinPhase('quiz');
  };

  const bigFinShareWin = async () => {
    try {
      await Share.share({
        message: `Level ${bigFinActiveLevel} done! Someone just joined your party`,
      });
    } catch (e) {
      Alert.alert('Share error', String(e?.message || e));
    }
  };

  const bigFinShareLose = async () => {
    try {
      await Share.share({
        message: `Game over (Level ${bigFinActiveLevel}). The music stopped!`,
      });
    } catch (e) {
      Alert.alert('Share error', String(e?.message || e));
    }
  };

  const bigFinPickAnswer = pickIdx => {
    if (bigFinPickedIndex !== null) return;

    setBigFinPickedIndex(pickIdx);
    const nextIndex = bigFinQuestionIndex + 1;

    setTimeout(() => {
      if (pickIdx !== bigFinCurrentCard?.correct) {
        setBigFinPhase('over');
        return;
      }

      if (!bigFinLevelPack || nextIndex >= bigFinLevelPack.length) {
        setBigFinPhase('done');
      } else {
        setBigFinQuestionIndex(nextIndex);

        setBigFinPickedIndex(null);
      }
    }, 600);
  };

  if (bigFinPhase === 'over') {
    return (
      <ImageBackground
        source={require('../assets/finImages/loseBg.png')}
        style={bigFinStyles.bigFinRoot}
      >
        <SafeAreaView style={bigFinStyles.bigFinCenter}>
          <Image source={require('../assets/finImages/gameOverText.png')} />
          <Text style={[bigFinStyles.bigFinHeadline, { marginBottom: 60 }]}>
            The music stopped...
          </Text>

          <BigFinPrimaryButton
            label="Retry Level"
            onPress={() => {
              setBigFinQuestionIndex(0);
              setBigFinPickedIndex(null);
              setBigFinPhase('quiz');
            }}
          />
          <BigFinPrimaryButton label="Share" onPress={bigFinShareLose} />
          <BigFinPrimaryButton
            label="Exit"
            onPress={() => navigation.goBack()}
          />
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (bigFinPhase === 'done') {
    const hasNext = Boolean(bigFinQuizQuestions[bigFinActiveLevel + 1]);

    return (
      <ImageBackground
        source={require('../assets/finImages/doneBg.png')}
        style={bigFinStyles.bigFinRoot}
      >
        <SafeAreaView style={bigFinStyles.bigFinCenter}>
          <Image source={require('../assets/finImages/doneText.png')} />
          <Text style={bigFinStyles.bigFinHeadline}>
            Someone just joined your party!
          </Text>

          <Text style={bigFinStyles.bigFinSub}>
            Looks like a new fish heard Big Fin’s voice{'\n'}
            and decided to join the party!
          </Text>

          <Image
            source={require('../assets/finImages/fin_happy.png')}
            style={bigFinStyles.bigFinHappyImg}
          />

          <BigFinPrimaryButton
            label={hasNext ? 'Next level' : 'Party Zone'}
            onPress={() => {
              if (hasNext) bigFinRestartToLevel(bigFinActiveLevel + 1);
              else navigation.navigate('BigFinPartyZoneScreen');
            }}
          />

          <BigFinPrimaryButton
            label="Party Zone"
            onPress={() => navigation.navigate('BigFinPartyZoneScreen')}
          />
          <BigFinPrimaryButton label="Share" onPress={bigFinShareWin} />
          <BigFinPrimaryButton
            label="Exit"
            onPress={() => navigation.goBack()}
          />
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../assets/finImages/gameBg.png')}
      style={bigFinStyles.bigFinRoot}
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
            end={{ x: 1, y: 0 }}
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
                {` Level ${bigFinActiveLevel}`}
              </Text>

              <Image
                source={require('../assets/finImages/bottomStars.png')}
                style={bigFinStyles.bigFinHeaderStars}
              />
            </View>
          </LinearGradient>
        </LinearGradient>

        <View
          style={[
            bigFinStyles.bigFinQuestionCard,
            { marginTop: isSDevice ? 30 : 40 },
            { minHeight: isSDevice ? 150 : 200 },
          ]}
        >
          <Text
            style={[
              bigFinStyles.bigFinQuestionText,
              isSDevice ? { fontSize: 16 } : { fontSize: 20 },
            ]}
          >
            {bigFinCurrentCard?.q}
          </Text>
        </View>

        <View style={bigFinStyles.bigFinAnswersWrap}>
          {bigFinCurrentCard?.answers?.map((label, i) => {
            const isCorrect =
              bigFinPickedIndex !== null && i === bigFinCurrentCard.correct;
            const isWrong =
              bigFinPickedIndex === i && i !== bigFinCurrentCard.correct;

            return (
              <TouchableOpacity
                key={`${bigFinActiveLevel}-${bigFinQuestionIndex}-${i}`}
                disabled={bigFinPickedIndex !== null}
                activeOpacity={0.7}
                onPress={() => bigFinPickAnswer(i)}
                style={{ alignSelf: 'center', width: '60%' }}
              >
                <LinearGradient
                  colors={
                    isCorrect
                      ? ['#78E9DC', '#249881']
                      : isWrong
                      ? ['#E98178', '#982424']
                      : ['#DE78E9', '#9b24ceff', '#3D2498']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={bigFinStyles.bigFinAnswerBtn}
                >
                  <View style={{ paddingHorizontal: 8 }}>
                    <Text
                      style={[
                        bigFinStyles.bigFinAnswerText,
                        isSDevice ? { fontSize: 14 } : { fontSize: 16 },
                      ]}
                    >
                      {label}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

function BigFinPrimaryButton({ label, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ marginVertical: 6 }}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={['#FE9200', '#FDEF70', '#FD3213']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={bigFinStyles.bigFinPrimaryBtn}
      >
        <Text style={bigFinStyles.bigFinPrimaryText}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
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

  bigFinQuestionCard: {
    marginHorizontal: 24,
    marginTop: 40,
    padding: 24,
    backgroundColor: '#f282f0ff',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#F9CDF9',
    minHeight: 200,
    justifyContent: 'center',
  },

  bigFinQuestionText: { color: '#fff', fontSize: 20, textAlign: 'center' },

  bigFinAnswersWrap: { marginTop: 30, gap: 16 },

  bigFinAnswerBtn: {
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 70,
    minWidth: 250,
    borderWidth: 1,
    borderColor: '#F9CDF9',
  },

  bigFinAnswerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  bigFinCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  bigFinHeadline: {
    fontSize: 18,
    color: '#FDEB57',
    textAlign: 'center',
    fontWeight: '900',
    marginTop: 14,
  },

  bigFinSub: {
    fontSize: 16,
    color: '#FDE6D9',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },

  bigFinHappyImg: { marginVertical: 20 },

  bigFinPrimaryBtn: {
    height: 50,
    width: 216,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bigFinPrimaryText: {
    color: '#10063D',
    fontSize: 18,
    fontWeight: '500',
    fontStyle: 'italic',
  },
});
