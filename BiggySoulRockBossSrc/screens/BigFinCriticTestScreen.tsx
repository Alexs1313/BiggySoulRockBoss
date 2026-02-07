import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  Share,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { quizQuestions as bigFinQuizQuestions } from '../data/quizQuestions';

const biggySoulAsyncKeys = {
  criticMaxLevel: 'critic_max_level',
  partyFishUnlocked: 'party_fish_unlocked',
};

const biggySoulAsyncStoryKeys = {
  storiesUnlockedCount: 'stories_unlocked_count',
  storyMaxLevel: 'story_max_level',
};

const biggySoulSafeNumber = (n: number) => (Number.isFinite(n) ? n : 0);

type BiggySoulRouteParams = {
  level?: number;
};

type BiggySoulQuestionCard = {
  q: string;
  answers: string[];
  correct: number;
};

export function BigFinCriticTestScreen() {
  const navigationBiggySoul = useNavigation<any>();
  const routeBiggySoul = useRoute<any>();

  const rawLevelBiggySoul = Number(
    (routeBiggySoul?.params as BiggySoulRouteParams)?.level || 1,
  );
  const biggySoulLevel = Math.max(
    1,
    Math.min(6, biggySoulSafeNumber(rawLevelBiggySoul)),
  );

  const [biggySoulActiveLevel, setBiggySoulActiveLevel] =
    useState<number>(biggySoulLevel);
  const [biggySoulQuestionIndex, setBiggySoulQuestionIndex] =
    useState<number>(0);
  const [biggySoulPickedIndex, setBiggySoulPickedIndex] = useState<
    number | null
  >(null);
  const [biggySoulPhase, setBiggySoulPhase] = useState<
    'quiz' | 'over' | 'done'
  >('quiz');

  const { height: heightBiggySoul } = useWindowDimensions();
  const isSmallDeviceBiggySoul = heightBiggySoul < 700;

  useEffect(() => {
    setBiggySoulActiveLevel(biggySoulLevel);
    setBiggySoulQuestionIndex(0);
    setBiggySoulPickedIndex(null);
    setBiggySoulPhase('quiz');
  }, [biggySoulLevel]);

  const biggySoulLevelPack = useMemo(() => {
    return (bigFinQuizQuestions as any)[biggySoulActiveLevel] as
      | BiggySoulQuestionCard[]
      | undefined;
  }, [biggySoulActiveLevel]);

  const biggySoulCurrentCard = biggySoulLevelPack?.[biggySoulQuestionIndex];

  const biggySoulSaveLevelRewards = async (doneLevelBiggySoul: number) => {
    try {
      const maxRawBiggySoul = await AsyncStorage.getItem(
        biggySoulAsyncKeys.criticMaxLevel,
      );
      const maxSavedBiggySoul = maxRawBiggySoul
        ? parseInt(maxRawBiggySoul, 10)
        : 0;

      const newMaxBiggySoul = Math.max(maxSavedBiggySoul, doneLevelBiggySoul);
      await AsyncStorage.setItem(
        biggySoulAsyncKeys.criticMaxLevel,
        String(newMaxBiggySoul),
      );

      const shouldUnlockFishBiggySoul = Math.min(7, doneLevelBiggySoul + 1);
      const fishRawBiggySoul = await AsyncStorage.getItem(
        biggySoulAsyncKeys.partyFishUnlocked,
      );
      const fishSavedBiggySoul = fishRawBiggySoul
        ? parseInt(fishRawBiggySoul, 10)
        : 1;

      const fishNewBiggySoul = Math.max(
        fishSavedBiggySoul,
        shouldUnlockFishBiggySoul,
      );
      await AsyncStorage.setItem(
        biggySoulAsyncKeys.partyFishUnlocked,
        String(fishNewBiggySoul),
      );

      const storyMaxRawBiggySoul = await AsyncStorage.getItem(
        biggySoulAsyncStoryKeys.storyMaxLevel,
      );
      const storyMaxSavedBiggySoul = storyMaxRawBiggySoul
        ? parseInt(storyMaxRawBiggySoul, 10)
        : 0;

      if (doneLevelBiggySoul > storyMaxSavedBiggySoul) {
        const countRawBiggySoul = await AsyncStorage.getItem(
          biggySoulAsyncStoryKeys.storiesUnlockedCount,
        );
        const countSavedBiggySoul = countRawBiggySoul
          ? parseInt(countRawBiggySoul, 10)
          : 0;

        const countNewBiggySoul = Math.min(6, countSavedBiggySoul + 1);

        await AsyncStorage.setItem(
          biggySoulAsyncStoryKeys.storiesUnlockedCount,
          String(countNewBiggySoul),
        );
        await AsyncStorage.setItem(
          biggySoulAsyncStoryKeys.storyMaxLevel,
          String(doneLevelBiggySoul),
        );
      }
    } catch (errorBiggySoul) {
      console.log('save Rewards fail', errorBiggySoul);
    }
  };

  useEffect(() => {
    if (biggySoulPhase === 'done')
      biggySoulSaveLevelRewards(biggySoulActiveLevel);
  }, [biggySoulPhase, biggySoulActiveLevel]);

  const biggySoulRestartToLevel = (nextLevelBiggySoul: number) => {
    setBiggySoulActiveLevel(nextLevelBiggySoul);
    setBiggySoulQuestionIndex(0);
    setBiggySoulPickedIndex(null);
    setBiggySoulPhase('quiz');
  };

  const biggySoulShareWin = async () => {
    try {
      await Share.share({
        message: `Level ${biggySoulActiveLevel} done! Someone just joined your party`,
      });
    } catch (errorBiggySoul: any) {
      Alert.alert(
        'Share error',
        String(errorBiggySoul?.message || errorBiggySoul),
      );
    }
  };

  const biggySoulShareLose = async () => {
    try {
      await Share.share({
        message: `Game over (Level ${biggySoulActiveLevel}). The music stopped!`,
      });
    } catch (errorBiggySoul: any) {
      Alert.alert(
        'Share error',
        String(errorBiggySoul?.message || errorBiggySoul),
      );
    }
  };

  const biggySoulPickAnswer = (pickIndexBiggySoul: number) => {
    if (biggySoulPickedIndex !== null) return;

    setBiggySoulPickedIndex(pickIndexBiggySoul);
    const nextIndexBiggySoul = biggySoulQuestionIndex + 1;

    setTimeout(() => {
      if (pickIndexBiggySoul !== biggySoulCurrentCard?.correct) {
        setBiggySoulPhase('over');
        return;
      }

      if (
        !biggySoulLevelPack ||
        nextIndexBiggySoul >= biggySoulLevelPack.length
      ) {
        setBiggySoulPhase('done');
      } else {
        setBiggySoulQuestionIndex(nextIndexBiggySoul);
        setBiggySoulPickedIndex(null);
      }
    }, 600);
  };

  if (biggySoulPhase === 'over') {
    return (
      <ImageBackground
        source={require('../assets/finImages/loseBg.png')}
        style={biggySoulRoot}
      >
        <SafeAreaView style={biggySoulCenter}>
          <Image source={require('../assets/finImages/gameOverText.png')} />
          <Text style={[biggySoulHeadline, { marginBottom: 60 }]}>
            The music stopped...
          </Text>

          <BiggySoulPrimaryButton
            label="Retry Level"
            onPress={() => {
              setBiggySoulQuestionIndex(0);
              setBiggySoulPickedIndex(null);
              setBiggySoulPhase('quiz');
            }}
          />
          <BiggySoulPrimaryButton label="Share" onPress={biggySoulShareLose} />
          <BiggySoulPrimaryButton
            label="Exit"
            onPress={() => navigationBiggySoul.goBack()}
          />
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (biggySoulPhase === 'done') {
    const hasNextBiggySoul = Boolean(
      (bigFinQuizQuestions as any)[biggySoulActiveLevel + 1],
    );

    return (
      <ImageBackground
        source={require('../assets/finImages/doneBg.png')}
        style={biggySoulRoot}
      >
        <SafeAreaView style={biggySoulCenter}>
          <Image source={require('../assets/finImages/doneText.png')} />
          <Text style={biggySoulHeadline}>Someone just joined your party!</Text>

          <Text style={biggySoulSub}>
            Looks like a new fish heard Big Fin’s voice{'\n'}
            and decided to join the party!
          </Text>

          <Image
            source={require('../assets/finImages/fin_happy.png')}
            style={biggySoulHappyImg}
          />

          <BiggySoulPrimaryButton
            label={hasNextBiggySoul ? 'Next level' : 'Party Zone'}
            onPress={() => {
              if (hasNextBiggySoul)
                biggySoulRestartToLevel(biggySoulActiveLevel + 1);
              else navigationBiggySoul.navigate('BigFinPartyZoneScreen');
            }}
          />

          <BiggySoulPrimaryButton
            label="Party Zone"
            onPress={() =>
              navigationBiggySoul.navigate('BigFinPartyZoneScreen')
            }
          />
          <BiggySoulPrimaryButton label="Share" onPress={biggySoulShareWin} />
          <BiggySoulPrimaryButton
            label="Exit"
            onPress={() => navigationBiggySoul.goBack()}
          />
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../assets/finImages/gameBg.png')}
      style={biggySoulRoot}
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
            end={{ x: 1, y: 0 }}
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
                  isSmallDeviceBiggySoul ? { fontSize: 18 } : { fontSize: 22 },
                ]}
              >
                {` Level ${biggySoulActiveLevel}`}
              </Text>

              <Image
                source={require('../assets/finImages/bottomStars.png')}
                style={biggySoulHeaderStars}
              />
            </View>
          </LinearGradient>
        </LinearGradient>

        <View
          style={[
            biggySoulQuestionCard,
            { marginTop: isSmallDeviceBiggySoul ? 30 : 40 },
            { minHeight: isSmallDeviceBiggySoul ? 150 : 200 },
          ]}
        >
          <Text
            style={[
              biggySoulQuestionText,
              isSmallDeviceBiggySoul ? { fontSize: 16 } : { fontSize: 20 },
            ]}
          >
            {biggySoulCurrentCard?.q}
          </Text>
        </View>

        <View style={biggySoulAnswersWrap}>
          {biggySoulCurrentCard?.answers?.map(
            (labelBiggySoul: string, iBiggySoul: number) => {
              const isCorrectBiggySoul =
                biggySoulPickedIndex !== null &&
                iBiggySoul === biggySoulCurrentCard.correct;
              const isWrongBiggySoul =
                biggySoulPickedIndex === iBiggySoul &&
                iBiggySoul !== biggySoulCurrentCard.correct;

              return (
                <TouchableOpacity
                  key={`${biggySoulActiveLevel}-${biggySoulQuestionIndex}-${iBiggySoul}`}
                  disabled={biggySoulPickedIndex !== null}
                  activeOpacity={0.7}
                  onPress={() => biggySoulPickAnswer(iBiggySoul)}
                  style={biggySoulAnswerTouchable}
                >
                  <LinearGradient
                    colors={
                      isCorrectBiggySoul
                        ? ['#78E9DC', '#249881']
                        : isWrongBiggySoul
                        ? ['#E98178', '#982424']
                        : ['#DE78E9', '#9b24ceff', '#3D2498']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={biggySoulAnswerBtn}
                  >
                    <View style={biggySoulAnswerInner}>
                      <Text
                        style={[
                          biggySoulAnswerText,
                          isSmallDeviceBiggySoul
                            ? { fontSize: 14 }
                            : { fontSize: 16 },
                        ]}
                      >
                        {labelBiggySoul}
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            },
          )}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

type BiggySoulPrimaryButtonProps = {
  label: string;
  onPress: () => void;
};

function BiggySoulPrimaryButton({
  label,
  onPress,
}: BiggySoulPrimaryButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={biggySoulPrimaryBtnWrap}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={['#FE9200', '#FDEF70', '#FD3213']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={biggySoulPrimaryBtn}
      >
        <Text style={biggySoulPrimaryText}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const biggySoulRoot = { flex: 1 };

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

const biggySoulQuestionCard = {
  marginHorizontal: 24,
  marginTop: 40,
  padding: 24,
  backgroundColor: '#f282f0ff',
  borderRadius: 12,
  borderWidth: 3,
  borderColor: '#F9CDF9',
  minHeight: 200,
  justifyContent: 'center' as const,
};

const biggySoulQuestionText = {
  color: '#fff',
  fontSize: 20,
  textAlign: 'center' as const,
};

const biggySoulAnswersWrap = {
  marginTop: 30,
  gap: 16,
};

const biggySoulAnswerTouchable = {
  alignSelf: 'center' as const,
  width: '60%',
};

const biggySoulAnswerBtn = {
  borderRadius: 20,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  minHeight: 70,
  minWidth: 250,
  borderWidth: 1,
  borderColor: '#F9CDF9',
};

const biggySoulAnswerInner = { paddingHorizontal: 8 };

const biggySoulAnswerText = {
  color: '#fff',
  fontSize: 16,
  fontWeight: '500' as const,
  textAlign: 'center' as const,
  fontStyle: 'italic' as const,
};

const biggySoulCenter = {
  flex: 1,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  paddingHorizontal: 24,
};

const biggySoulHeadline = {
  fontSize: 18,
  color: '#FDEB57',
  textAlign: 'center' as const,
  fontWeight: '900' as const,
  marginTop: 14,
};

const biggySoulSub = {
  fontSize: 16,
  color: '#FDE6D9',
  textAlign: 'center' as const,
  marginTop: 8,
  fontWeight: '500' as const,
};

const biggySoulHappyImg = { marginVertical: 20 };

const biggySoulPrimaryBtnWrap = { marginVertical: 6 };

const biggySoulPrimaryBtn = {
  height: 50,
  width: 216,
  borderRadius: 12,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

const biggySoulPrimaryText = {
  color: '#10063D',
  fontSize: 18,
  fontWeight: '500' as const,
  fontStyle: 'italic' as const,
};
