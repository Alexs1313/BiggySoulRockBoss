import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground as FinBack,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const biggySoulStorageKeys = {
  totalScore: 'flamingo_total_score',
  unlockedFish: 'party_fish_unlocked',
  fishAccessories: 'party_fish1_accessories',
  fishSkin: 'party_fish1_skin',
};

const biggySoulAssets = {
  danceBg: require('../assets/finImages/danceBg.png'),
  backArrow: require('../assets/finImages/bxs_up-arrow.png'),
  bottomStars: require('../assets/finImages/bottomStars.png'),
  addIcon: require('../assets/finImages/addIcon.png'),
  topBadge: require('../assets/finImages/topQ.png'),
  flamIcon: require('../assets/finImages/flam.png'),
};

const biggySoulFishImages = {
  base: require('../assets/finImages/acsses1.1.png'),
  baseAlt: require('../assets/finImages/accses1.png'),
  fish2: require('../assets/finImages/accses2.png'),
  fish3: require('../assets/finImages/accses3.png'),
  fish4: require('../assets/finImages/accses4.png'),
  fish6: require('../assets/finImages/accses6.png'),
  fish7: require('../assets/finImages/accses7.png'),
  fish9: require('../assets/finImages/accses9.png'),
};

const biggySoulAccessoryLayers = [
  { img: require('../assets/finImages/accses5.png') },
  { img: require('../assets/finImages/accses5.png') },
  { img: require('../assets/finImages/accses8.png') },
];

const biggySoulSafeNumber = (n: any) => (Number.isFinite(n) ? n : 0);

export default function BigFinPartyZoneScreen() {
  const navigationBiggySoul = useNavigation<any>();
  const { width: biggySoulWidth, height: biggySoulHeight } =
    useWindowDimensions();

  const biggySoulAccessoryPrice = 30;
  const biggySoulIsSmallDevice = biggySoulHeight < 700;

  const [biggySoulScore, setBiggySoulScore] = useState(0);
  const [biggySoulUnlockedFishCount, setBiggySoulUnlockedFishCount] =
    useState(1);
  const [biggySoulOwnedAccessories, setBiggySoulOwnedAccessories] = useState<
    number[]
  >([0, 0, 0]);
  const [biggySoulSkinFlag, setBiggySoulSkinFlag] = useState(0);

  const [biggySoulModalVisible, setBiggySoulModalVisible] = useState(false);
  const [biggySoulSelectedSlot, setBiggySoulSelectedSlot] = useState<
    number | null
  >(null);

  const biggySoulDecorKeys = [
    biggySoulFishImages.base,
    biggySoulFishImages.fish2,
    biggySoulFishImages.fish3,
    biggySoulFishImages.fish4,
    biggySoulFishImages.fish6,
    biggySoulFishImages.fish7,
    biggySoulFishImages.fish9,
  ];

  const biggySoulFishPositions = useMemo(() => {
    return [
      {
        left: biggySoulWidth * 0.52,
        top: biggySoulHeight * 0.23,
        w: 140,
        h: 160,
      },
      { left: biggySoulWidth * 0.2, top: biggySoulHeight * 0.28, w: 90, h: 90 },
      {
        left: biggySoulWidth * 0.13,
        top: biggySoulHeight * 0.44,
        w: 120,
        h: 120,
      },
      {
        right: biggySoulWidth * 0.05,
        top: biggySoulHeight * 0.53,
        w: 110,
        h: 110,
      },
      {
        left: biggySoulWidth * 0.4,
        top: biggySoulHeight * 0.4,
        w: 117,
        h: 138,
      },
      { right: biggySoulWidth * 0, top: biggySoulHeight * 0.33, w: 95, h: 95 },
      { left: 0, top: biggySoulHeight * 0.05, w: 92, h: 67 },
    ];
  }, [biggySoulWidth, biggySoulHeight]);

  const biggySoulAccessoryLayerDefs = useMemo(() => {
    return [
      {
        img: biggySoulAccessoryLayers[0].img,
        style: {
          position: 'absolute' as const,
          left: 0,
          top: biggySoulHeight * 0.24,
        },
      },
      {
        img: biggySoulAccessoryLayers[1].img,
        style: {
          position: 'absolute' as const,
          left: biggySoulWidth * 0.08,
          top: biggySoulHeight * 0.16,
        },
      },
      {
        img: biggySoulAccessoryLayers[2].img,
        style: {
          position: 'absolute' as const,
          left: 0,
          top: biggySoulHeight * 0.6,
        },
      },
    ];
  }, [biggySoulWidth, biggySoulHeight]);

  const biggySoulAddButtonPositions = useMemo(() => {
    return [
      { left: biggySoulWidth * 0.08, top: biggySoulHeight * 0.44 },
      { left: biggySoulWidth * 0.46, top: biggySoulHeight * 0.3 },
      { left: biggySoulWidth * 0.22, top: biggySoulHeight * 0.68 },
    ];
  }, [biggySoulWidth, biggySoulHeight]);

  const biggySoulLoadPartyZone = useCallback(async () => {
    try {
      const storedScoresBiggySoul = await AsyncStorage.getItem(
        biggySoulStorageKeys.totalScore,
      );
      const parsedScoreBiggySoul = storedScoresBiggySoul
        ? parseInt(storedScoresBiggySoul, 10)
        : 0;

      setBiggySoulScore(biggySoulSafeNumber(parsedScoreBiggySoul));

      const storedUnlockedBiggySoul = await AsyncStorage.getItem(
        biggySoulStorageKeys.unlockedFish,
      );
      const parsedUnlockedBiggySoul = storedUnlockedBiggySoul
        ? parseInt(storedUnlockedBiggySoul, 10)
        : 1;

      setBiggySoulUnlockedFishCount(
        Math.max(
          1,
          Math.min(7, biggySoulSafeNumber(parsedUnlockedBiggySoul || 1)),
        ),
      );

      const storedAccessoriesBiggySoul = await AsyncStorage.getItem(
        biggySoulStorageKeys.fishAccessories,
      );

      if (storedAccessoriesBiggySoul) {
        const parsedAccessoriesBiggySoul = JSON.parse(
          storedAccessoriesBiggySoul,
        );

        if (
          Array.isArray(parsedAccessoriesBiggySoul) &&
          parsedAccessoriesBiggySoul.length === 3
        ) {
          setBiggySoulOwnedAccessories(
            parsedAccessoriesBiggySoul.map((v: any) => (v ? 1 : 0)),
          );
        }
      } else {
        await AsyncStorage.setItem(
          biggySoulStorageKeys.fishAccessories,
          JSON.stringify([0, 0, 0]),
        );
        setBiggySoulOwnedAccessories([0, 0, 0]);
      }

      const storedSkinBiggySoul = await AsyncStorage.getItem(
        biggySoulStorageKeys.fishSkin,
      );

      if (storedSkinBiggySoul === null) {
        await AsyncStorage.setItem(biggySoulStorageKeys.fishSkin, '0');
        setBiggySoulSkinFlag(0);
      } else {
        setBiggySoulSkinFlag(Number(storedSkinBiggySoul) ? 1 : 0);
      }
    } catch (e) {
      console.log('Party error:', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      biggySoulLoadPartyZone();
    }, [biggySoulLoadPartyZone]),
  );

  const biggySoulOpenSlotModal = (slotIndex: number) => {
    if (biggySoulOwnedAccessories[slotIndex] === 1) return;
    setBiggySoulSelectedSlot(slotIndex);
    setBiggySoulModalVisible(true);
  };

  const biggySoulCloseModal = () => {
    setBiggySoulModalVisible(false);
    setBiggySoulSelectedSlot(null);
  };

  const biggySoulConfirmBuyAccessory = useCallback(async () => {
    if (biggySoulSelectedSlot === null) return;

    biggySoulCloseModal();

    if (biggySoulOwnedAccessories[biggySoulSelectedSlot] === 1) return;

    const nextScoreBiggySoul = biggySoulScore - biggySoulAccessoryPrice;
    const nextOwnedBiggySoul = [...biggySoulOwnedAccessories];
    nextOwnedBiggySoul[biggySoulSelectedSlot] = 1;

    let nextSkinBiggySoul = biggySoulSkinFlag;
    if (biggySoulSelectedSlot === 1) nextSkinBiggySoul = 1;

    if (nextScoreBiggySoul < 0) {
      Alert.alert(
        'Not enough points',
        'You do not have enough points to buy this accessory.',
      );
      return;
    }

    try {
      await AsyncStorage.setItem(
        biggySoulStorageKeys.totalScore,
        String(nextScoreBiggySoul),
      );
      await AsyncStorage.setItem(
        biggySoulStorageKeys.fishAccessories,
        JSON.stringify(nextOwnedBiggySoul),
      );
      await AsyncStorage.setItem(
        biggySoulStorageKeys.fishSkin,
        String(nextSkinBiggySoul),
      );

      setBiggySoulScore(nextScoreBiggySoul);
      setBiggySoulOwnedAccessories(nextOwnedBiggySoul);
      setBiggySoulSkinFlag(nextSkinBiggySoul);
    } catch (e) {
      console.log('error:', e);
    }
  }, [
    biggySoulSelectedSlot,
    biggySoulOwnedAccessories,
    biggySoulScore,
    biggySoulAccessoryPrice,
    biggySoulSkinFlag,
  ]);

  function BigFinPillButton({
    label,
    onPress,
  }: {
    label: string;
    onPress: () => void;
  }) {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
        <LinearGradient
          colors={['#1E033D', '#1E033D']}
          style={[
            biggySoulPillBtn,
            biggySoulIsSmallDevice ? { width: 100, height: 36 } : null,
          ]}
        >
          <Text
            style={[
              biggySoulPillBtnText,
              biggySoulIsSmallDevice ? { fontSize: 16 } : null,
            ]}
          >
            {label}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <FinBack
      source={biggySoulAssets.danceBg}
      style={biggySoulRoot}
      resizeMode="cover"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: Platform.OS === 'android' ? biggySoulHeight * 0.06 : 0,
          height: '600' as any,
        }}
      >
        <SafeAreaView style={biggySoulSafe}>
          <View style={biggySoulHeaderWrap}>
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
                style={{
                  padding: Platform.OS === 'ios' ? 2 : 0,
                  borderRadius: 16,
                  width: '100%',
                }}
              >
                <View style={biggySoulHeaderInner}>
                  <TouchableOpacity
                    onPress={() => navigationBiggySoul.goBack()}
                    style={biggySoulBackBtn}
                    activeOpacity={0.8}
                  >
                    <Image source={biggySoulAssets.backArrow} />
                  </TouchableOpacity>

                  <Text
                    style={[
                      biggySoulHeaderTitle,
                      biggySoulIsSmallDevice && { fontSize: 18 },
                    ]}
                  >
                    Party Zone
                  </Text>

                  <Image
                    source={biggySoulAssets.bottomStars}
                    style={biggySoulHeaderStars}
                    resizeMode="stretch"
                  />
                </View>
              </LinearGradient>
            </LinearGradient>

            <FinBack
              style={biggySoulScoreBadge}
              source={biggySoulAssets.topBadge}
            >
              <Text
                style={[
                  biggySoulScoreText,
                  biggySoulIsSmallDevice && { fontSize: 18 },
                ]}
              >
                {biggySoulScore}
              </Text>
            </FinBack>
          </View>

          <View style={biggySoulStage}>
            {biggySoulAccessoryLayerDefs.map((layer, slotIndex) => {
              if (!biggySoulOwnedAccessories[slotIndex]) return null;
              if (slotIndex === 1 && biggySoulSkinFlag === 1) return null;

              return (
                <Image
                  key={slotIndex}
                  source={layer.img}
                  style={layer.style}
                  resizeMode="contain"
                />
              );
            })}

            {biggySoulDecorKeys
              .slice(0, biggySoulUnlockedFishCount)
              .map((img, i) => {
                const pos =
                  biggySoulFishPositions[i] || biggySoulFishPositions[0];

                const finalImg =
                  i === 0
                    ? biggySoulSkinFlag === 1
                      ? biggySoulFishImages.baseAlt
                      : biggySoulFishImages.base
                    : img;

                return (
                  <Image
                    key={i}
                    source={finalImg}
                    resizeMode="contain"
                    style={[
                      biggySoulFishLayer,
                      {
                        position: 'absolute',
                        left: (pos as any).left,
                        right: (pos as any).right,
                        top: (pos as any).top,
                        bottom: (pos as any).bottom,
                        width: (pos as any).w,
                        height: (pos as any).h,
                      },
                    ]}
                  />
                );
              })}

            {biggySoulAddButtonPositions.map((pos, slotIndex) => {
              if (biggySoulOwnedAccessories[slotIndex] === 1) return null;

              return (
                <TouchableOpacity
                  key={slotIndex}
                  activeOpacity={0.85}
                  onPress={() => biggySoulOpenSlotModal(slotIndex)}
                  style={[
                    biggySoulAddBtn,
                    { position: 'absolute', left: pos.left, top: pos.top },
                  ]}
                >
                  <Image source={biggySoulAssets.addIcon} />
                </TouchableOpacity>
              );
            })}
          </View>

          <Modal
            transparent
            visible={biggySoulModalVisible}
            animationType="fade"
            onRequestClose={biggySoulCloseModal}
          >
            <View style={biggySoulModalOverlay}>
              <View
                style={[
                  biggySoulModalCard,
                  biggySoulIsSmallDevice ? { width: '85%' } : null,
                ]}
              >
                <LinearGradient
                  colors={['#610EAC', '#C83DD7']}
                  style={biggySoulModalGradient}
                >
                  <View style={{ padding: 18, paddingTop: 24 }}>
                    <Text
                      style={[
                        biggySoulModalTitle,
                        biggySoulIsSmallDevice ? { fontSize: 18 } : null,
                      ]}
                    >
                      Add accessory for:
                    </Text>

                    <View style={biggySoulPriceRow}>
                      <Text
                        style={[
                          biggySoulPriceText,
                          biggySoulIsSmallDevice ? { fontSize: 18 } : null,
                        ]}
                      >
                        {biggySoulAccessoryPrice}
                      </Text>
                      <Image source={biggySoulAssets.flamIcon} />
                    </View>

                    <View style={biggySoulModalButtonsRow}>
                      <BigFinPillButton
                        label="No"
                        onPress={biggySoulCloseModal}
                      />
                      <BigFinPillButton
                        label="Yes"
                        onPress={biggySoulConfirmBuyAccessory}
                      />
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </ScrollView>
    </FinBack>
  );
}

const biggySoulRoot = { flex: 1 };

const biggySoulSafe = { flex: 1 };

const biggySoulHeaderWrap = { alignItems: 'center' as const };

const biggySoulHeaderOuter = {
  width: '92%' as const,
  borderRadius: 16,
  padding: 2,
};

const biggySoulHeaderInner = {
  borderRadius: 12,
  paddingVertical: 18,
  paddingHorizontal: 14,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  overflow: 'hidden' as const,
};

const biggySoulBackBtn = { position: 'absolute' as const, left: 20, zIndex: 2 };

const biggySoulHeaderTitle = {
  fontSize: 22,
  fontWeight: '900' as const,
  color: '#FDEB57',
};

const biggySoulHeaderStars = {
  position: 'absolute' as const,
  bottom: 0,
  left: 0,
  right: 0,
  height: 54,
  opacity: 0.9,
};

const biggySoulScoreBadge = {
  width: 132,
  height: 34,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  marginTop: 20,
};

const biggySoulScoreText = {
  color: '#FDEB57',
  fontSize: 20,
  textAlign: 'center' as const,
  fontWeight: '900' as const,
  left: 10,
};

const biggySoulStage = { flex: 1, position: 'relative' as const };

const biggySoulFishLayer = { zIndex: 3 };

const biggySoulAddBtn = { zIndex: 10 };

const biggySoulModalOverlay = {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.25)',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  paddingHorizontal: 18,
};

const biggySoulModalCard = {
  width: '88%' as const,
  borderRadius: 16,
  borderWidth: 2,
  borderColor: '#F9CDF9',
  overflow: 'hidden' as const,
};

const biggySoulModalGradient = { borderRadius: 16 };

const biggySoulModalTitle = {
  textAlign: 'center' as const,
  color: '#FFFFFF',
  fontSize: 20,
  fontWeight: '700' as const,
  marginBottom: 18,
};

const biggySoulPriceRow = {
  alignSelf: 'center' as const,
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  gap: 8,
  marginBottom: 14,
};

const biggySoulPriceText = {
  color: '#FFFFFF',
  fontSize: 22,
  fontWeight: '900' as const,
};

const biggySoulModalButtonsRow = {
  flexDirection: 'row' as const,
  justifyContent: 'center' as const,
  gap: 16,
  marginTop: 10,
};

const biggySoulPillBtn = {
  width: 120,
  height: 44,
  borderRadius: 50,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  borderWidth: 1,
  borderColor: '#691D7A',
};

const biggySoulPillBtnText = {
  color: '#FFFFFF',
  fontSize: 18,
  fontWeight: '500' as const,
  fontStyle: 'italic' as const,
};
