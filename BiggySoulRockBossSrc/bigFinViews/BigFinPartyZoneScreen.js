import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground as FinBack,
  Modal,
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
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const bigFinStorageKeys = {
  totalScore: 'flamingo_total_score',
  unlockedFish: 'party_fish_unlocked',
  fishAccessories: 'party_fish1_accessories',
  fishSkin: 'party_fish1_skin',
};

const bigFinAssets = {
  danceBg: require('../assets/finImages/danceBg.png'),
  backArrow: require('../assets/finImages/bxs_up-arrow.png'),
  bottomStars: require('../assets/finImages/bottomStars.png'),
  addIcon: require('../assets/finImages/addIcon.png'),
  topBadge: require('../assets/finImages/topQ.png'),
  flamIcon: require('../assets/finImages/flam.png'),
};

const bigFinFishImages = {
  base: require('../assets/finImages/acsses1.1.png'),
  baseAlt: require('../assets/finImages/accses1.png'),
  fish2: require('../assets/finImages/accses2.png'),
  fish3: require('../assets/finImages/accses3.png'),
  fish4: require('../assets/finImages/accses4.png'),
  fish6: require('../assets/finImages/accses6.png'),
  fish7: require('../assets/finImages/accses7.png'),
  fish9: require('../assets/finImages/accses9.png'),
};

const bigFinAccessoryLayers = [
  { img: require('../assets/finImages/accses5.png') },
  { img: require('../assets/finImages/accses5.png') },
  { img: require('../assets/finImages/accses8.png') },
];

const bigFinSafeNumber = n => (Number.isFinite(n) ? n : 0);

export default function BigFinPartyZoneScreen() {
  const navigation = useNavigation();
  const { width: bigFinWidth, height: bigFinHeight } = useWindowDimensions();

  const bigFinAccessoryPrice = 30;
  const isSDevice = bigFinHeight < 700;

  const [bigFinScore, setBigFinScore] = useState(0);
  const [bigFinUnlockedFishCount, setBigFinUnlockedFishCount] = useState(1);
  const [bigFinOwnedAccessories, setBigFinOwnedAccessories] = useState([
    0, 0, 0,
  ]);
  const [bigFinSkinFlag, setBigFinSkinFlag] = useState(0);

  const [bigFinModalVisible, setBigFinModalVisible] = useState(false);
  const [bigFinSelectedSlot, setBigFinSelectedSlot] = useState(null);

  const bigFinDecorKeys = [
    bigFinFishImages.base,
    bigFinFishImages.fish2,
    bigFinFishImages.fish3,
    bigFinFishImages.fish4,
    bigFinFishImages.fish6,
    bigFinFishImages.fish7,
    bigFinFishImages.fish9,
  ];

  const bigFinFishPositions = useMemo(() => {
    return [
      { left: bigFinWidth * 0.52, top: bigFinHeight * 0.23, w: 140, h: 160 },
      { left: bigFinWidth * 0.2, top: bigFinHeight * 0.28, w: 90, h: 90 },
      { left: bigFinWidth * 0.13, top: bigFinHeight * 0.44, w: 120, h: 120 },
      { right: bigFinWidth * 0.05, top: bigFinHeight * 0.53, w: 110, h: 110 },
      { left: bigFinWidth * 0.4, top: bigFinHeight * 0.4, w: 117, h: 138 },
      { right: bigFinWidth * 0, top: bigFinHeight * 0.33, w: 95, h: 95 },
      { left: 0, top: bigFinHeight * 0.05, w: 92, h: 67 },
    ];
  }, [bigFinWidth, bigFinHeight]);

  const bigFinAccessoryLayerDefs = useMemo(() => {
    return [
      {
        img: bigFinAccessoryLayers[0].img,
        style: { position: 'absolute', left: 0, top: bigFinHeight * 0.24 },
      },
      {
        img: bigFinAccessoryLayers[1].img,
        style: {
          position: 'absolute',
          left: bigFinWidth * 0.08,
          top: bigFinHeight * 0.16,
        },
      },
      {
        img: bigFinAccessoryLayers[2].img,
        style: { position: 'absolute', left: 0, top: bigFinHeight * 0.6 },
      },
    ];
  }, [bigFinWidth, bigFinHeight]);

  const bigFinAddButtonPositions = useMemo(() => {
    return [
      { left: bigFinWidth * 0.08, top: bigFinHeight * 0.44 },
      { left: bigFinWidth * 0.46, top: bigFinHeight * 0.3 },
      { left: bigFinWidth * 0.22, top: bigFinHeight * 0.68 },
    ];
  }, [bigFinWidth, bigFinHeight]);

  const bigFinLoadPartyZone = useCallback(async () => {
    try {
      const storedScores = await AsyncStorage.getItem(
        bigFinStorageKeys.totalScore,
      );

      const parsedScore = storedScores ? parseInt(storedScores, 10) : 0;

      setBigFinScore(bigFinSafeNumber(parsedScore));

      const storedUnlocked = await AsyncStorage.getItem(
        bigFinStorageKeys.unlockedFish,
      );
      const parsedUnlocked = storedUnlocked ? parseInt(storedUnlocked, 10) : 1;

      setBigFinUnlockedFishCount(
        Math.max(1, Math.min(7, bigFinSafeNumber(parsedUnlocked || 1))),
      );

      const storedAccessories = await AsyncStorage.getItem(
        bigFinStorageKeys.fishAccessories,
      );
      if (storedAccessories) {
        const parsedAccessories = JSON.parse(storedAccessories);

        if (
          Array.isArray(parsedAccessories) &&
          parsedAccessories.length === 3
        ) {
          setBigFinOwnedAccessories(parsedAccessories.map(v => (v ? 1 : 0)));
        }
      } else {
        await AsyncStorage.setItem(
          bigFinStorageKeys.fishAccessories,

          JSON.stringify([0, 0, 0]),
        );
        setBigFinOwnedAccessories([0, 0, 0]);
      }

      const storedFinSkins = await AsyncStorage.getItem(
        bigFinStorageKeys.fishSkin,
      );

      if (storedFinSkins === null) {
        await AsyncStorage.setItem(bigFinStorageKeys.fishSkin, '0');
        setBigFinSkinFlag(0);
      } else {
        setBigFinSkinFlag(Number(storedFinSkins) ? 1 : 0);
      }
    } catch (e) {
      console.log('Party error:', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      bigFinLoadPartyZone();
    }, [bigFinLoadPartyZone]),
  );

  const bigFinOpenSlotModal = slotIndex => {
    if (bigFinOwnedAccessories[slotIndex] === 1) return;

    setBigFinSelectedSlot(slotIndex);

    setBigFinModalVisible(true);
  };

  const bigFinCloseModal = () => {
    setBigFinModalVisible(false);

    setBigFinSelectedSlot(null);
  };

  const bigFinConfirmBuyAccessory = useCallback(async () => {
    if (bigFinSelectedSlot === null) return;

    bigFinCloseModal();

    if (bigFinOwnedAccessories[bigFinSelectedSlot] === 1) return;

    const nextScore = bigFinScore - bigFinAccessoryPrice;

    const nextOwned = [...bigFinOwnedAccessories];

    nextOwned[bigFinSelectedSlot] = 1;

    let nextSkin = bigFinSkinFlag;

    if (bigFinSelectedSlot === 1) nextSkin = 1;

    if (nextScore < 0) {
      Alert.alert(
        'Not enough points',
        'You do not have enough points to buy this accessory.',
      );
      return;
    }

    try {
      await AsyncStorage.setItem(
        bigFinStorageKeys.totalScore,
        String(nextScore),
      );
      await AsyncStorage.setItem(
        bigFinStorageKeys.fishAccessories,
        JSON.stringify(nextOwned),
      );
      await AsyncStorage.setItem(bigFinStorageKeys.fishSkin, String(nextSkin));

      setBigFinScore(nextScore);
      setBigFinOwnedAccessories(nextOwned);
      setBigFinSkinFlag(nextSkin);
    } catch (e) {
      console.log('error:', e);
    }
  }, [
    bigFinSelectedSlot,
    bigFinOwnedAccessories,
    bigFinScore,
    bigFinAccessoryPrice,
    bigFinSkinFlag,
  ]);

  function BigFinPillButton({ label, onPress }) {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
        <LinearGradient
          colors={['#1E033D', '#1E033D']}
          style={[
            bigFinStyles.bigFinPillBtn,
            isSDevice ? { width: 100, height: 36 } : null,
          ]}
        >
          <Text
            style={[
              bigFinStyles.bigFinPillBtnText,
              isSDevice ? { fontSize: 16 } : null,
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
      source={bigFinAssets.danceBg}
      style={bigFinStyles.bigFinRoot}
      resizeMode="cover"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: Platform.OS === 'android' ? bigFinHeight * 0.07 : 0,
          height: '600',
        }}
      >
        <SafeAreaView style={bigFinStyles.bigFinSafe}>
          <View style={bigFinStyles.bigFinHeaderWrap}>
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
                    activeOpacity={0.8}
                  >
                    <Image source={bigFinAssets.backArrow} />
                  </TouchableOpacity>

                  <Text
                    style={[
                      bigFinStyles.bigFinHeaderTitle,
                      isSDevice && { fontSize: 18 },
                    ]}
                  >
                    Party Zone
                  </Text>

                  <Image
                    source={bigFinAssets.bottomStars}
                    style={bigFinStyles.bigFinHeaderStars}
                    resizeMode="stretch"
                  />
                </View>
              </LinearGradient>
            </LinearGradient>

            <FinBack
              style={bigFinStyles.bigFinScoreBadge}
              source={bigFinAssets.topBadge}
            >
              <Text
                style={[
                  bigFinStyles.bigFinScoreText,
                  isSDevice && { fontSize: 18 },
                ]}
              >
                {bigFinScore}
              </Text>
            </FinBack>
          </View>

          <View style={bigFinStyles.bigFinStage}>
            {bigFinAccessoryLayerDefs.map((layer, slotIndex) => {
              if (!bigFinOwnedAccessories[slotIndex]) return null;
              if (slotIndex === 1 && bigFinSkinFlag === 1) return null;

              return (
                <Image
                  key={slotIndex}
                  source={layer.img}
                  style={layer.style}
                  resizeMode="contain"
                />
              );
            })}

            {bigFinDecorKeys.slice(0, bigFinUnlockedFishCount).map((img, i) => {
              const pos = bigFinFishPositions[i] || bigFinFishPositions[0];

              const finalImg =
                i === 0
                  ? bigFinSkinFlag === 1
                    ? bigFinFishImages.baseAlt
                    : bigFinFishImages.base
                  : img;

              return (
                <Image
                  key={i}
                  source={finalImg}
                  resizeMode="contain"
                  style={[
                    bigFinStyles.bigFinFishLayer,
                    {
                      position: 'absolute',
                      left: pos.left,
                      right: pos.right,
                      top: pos.top,
                      bottom: pos.bottom,
                      width: pos.w,
                      height: pos.h,
                    },
                  ]}
                />
              );
            })}

            {bigFinAddButtonPositions.map((pos, slotIndex) => {
              if (bigFinOwnedAccessories[slotIndex] === 1) return null;

              return (
                <TouchableOpacity
                  key={slotIndex}
                  activeOpacity={0.85}
                  onPress={() => bigFinOpenSlotModal(slotIndex)}
                  style={[
                    bigFinStyles.bigFinAddBtn,
                    { position: 'absolute', left: pos.left, top: pos.top },
                  ]}
                >
                  <Image source={bigFinAssets.addIcon} />
                </TouchableOpacity>
              );
            })}
          </View>

          <Modal
            transparent
            visible={bigFinModalVisible}
            animationType="fade"
            onRequestClose={bigFinCloseModal}
          >
            <View style={bigFinStyles.bigFinModalOverlay}>
              <View
                style={[
                  bigFinStyles.bigFinModalCard,
                  isSDevice ? { width: '85%' } : null,
                ]}
              >
                <LinearGradient
                  colors={['#610EAC', '#C83DD7']}
                  style={bigFinStyles.bigFinModalGradient}
                >
                  <View style={{ padding: 18, paddingTop: 24 }}>
                    <Text
                      style={[
                        bigFinStyles.bigFinModalTitle,
                        isSDevice ? { fontSize: 18 } : null,
                      ]}
                    >
                      Add accessory for:
                    </Text>

                    <View style={bigFinStyles.bigFinPriceRow}>
                      <Text
                        style={[
                          bigFinStyles.bigFinPriceText,
                          isSDevice ? { fontSize: 18 } : null,
                        ]}
                      >
                        {bigFinAccessoryPrice}
                      </Text>
                      <Image source={bigFinAssets.flamIcon} />
                    </View>

                    <View style={bigFinStyles.bigFinModalButtonsRow}>
                      <BigFinPillButton label="No" onPress={bigFinCloseModal} />
                      <BigFinPillButton
                        label="Yes"
                        onPress={bigFinConfirmBuyAccessory}
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

const bigFinStyles = StyleSheet.create({
  bigFinRoot: { flex: 1 },
  bigFinSafe: { flex: 1 },

  bigFinHeaderWrap: { alignItems: 'center' },

  bigFinHeaderOuter: { width: '92%', borderRadius: 16, padding: 2 },
  bigFinHeaderMid: { borderRadius: 14, padding: 2 },
  bigFinHeaderInner: {
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  bigFinBackBtn: { position: 'absolute', left: 20, zIndex: 2 },
  bigFinHeaderTitle: { fontSize: 22, fontWeight: '900', color: '#FDEB57' },

  bigFinHeaderStars: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 54,
    opacity: 0.9,
  },

  bigFinScoreBadge: {
    width: 132,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  bigFinScoreText: {
    color: '#FDEB57',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '900',
    left: 10,
  },

  bigFinStage: { flex: 1, position: 'relative' },

  bigFinFishLayer: { zIndex: 3 },

  bigFinAddBtn: { zIndex: 10 },

  bigFinModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },

  bigFinModalCard: {
    width: '88%',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F9CDF9',
    overflow: 'hidden',
  },

  bigFinModalGradient: { borderRadius: 16 },

  bigFinModalTitle: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 18,
  },

  bigFinPriceRow: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },

  bigFinPriceText: { color: '#FFFFFF', fontSize: 22, fontWeight: '900' },

  bigFinModalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 10,
  },

  bigFinPillBtn: {
    width: 120,
    height: 44,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#691D7A',
  },

  bigFinPillBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    fontStyle: 'italic',
  },
});
