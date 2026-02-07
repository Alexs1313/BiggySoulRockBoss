import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
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
import LinearGradient from 'react-native-linear-gradient';

const bigFinOnboard = [
  {
    title: 'Say Hi to Big Fin',
    description:
      "Big Fin dreams of performing on stage. But every time he tries, his inner critic whispers: 'You’re not ready…'",
    image: require('../assets/finImages/on1.png'),
    buttonLabel: 'Begin',
  },
  {
    title: 'One Big Goal',
    description:
      'Big Fin wants his voice to travel through the entire ocean. Not just to one fish — to everyone. So he decides to throw a huge underwater party.',
    image: require('../assets/finImages/on2.png'),
    buttonLabel: 'Next',
  },
  {
    title: 'Something Stands in the Way',
    description:
      'No one will show up if Big Fin keeps doubting himself. He needs your help to quiet that inner voice and invite friends to the party.',
    image: require('../assets/finImages/on3.png'),
    buttonLabel: 'Next',
  },
  {
    title: 'Tame the Inner Voice',
    description:
      'Complete mindset challenges about confidence and self-doubt.\nEach finished level brings 1 new friend to the party.',
    image: require('../assets/finImages/on4.png'),
    buttonLabel: 'Next',
  },
  {
    title: 'Collect Party Points',
    description:
      'Play the tap game to earn Flamingo Points.\nUse them to unlock upgrades and party decorations!',
    image: require('../assets/finImages/on5.png'),
    buttonLabel: 'Next',
  },
  {
    title: 'Make It Legendary',
    description:
      'Invite new friends\nRead their stories\nDecorate the dance floor\nHelp Big Fin shine\nLet’s throw an unforgettable party!',
    image: require('../assets/finImages/on6.png'),
    buttonLabel: "Let's Rock!",
  },
];

export default function IntroduceScreen() {
  const navigation = useNavigation<any>();
  const [bigFinCurrentSlide, setBigFinCurrentSlide] = useState(0);

  const { height: heightBiggySoul } = useWindowDimensions();
  const isSmallDeviceBiggySoul = heightBiggySoul < 700;

  const bigFinGoToNext = () => {
    if (bigFinCurrentSlide === bigFinOnboard.length - 1) {
      navigation.navigate('BigFinHomeScreen');
      return;
    }
    setBigFinCurrentSlide(prev => prev + 1);
  };

  const bigFinCurrent = bigFinOnboard[bigFinCurrentSlide];

  return (
    <ImageBackground
      source={require('../assets/finImages/levelsBg.png')}
      style={biggySoulRoot}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={biggySoulScroll}
        bounces={false}
      >
        <View style={[biggySoulScreen, { paddingTop: heightBiggySoul * 0.08 }]}>
          <View style={biggySoulCardWrap}>
            <Image
              source={require('../assets/finImages/menuFrame.png')}
              style={biggySoulCardFrame}
            />

            <Image
              source={bigFinCurrent.image}
              style={biggySoulSlideImage}
              resizeMode="cover"
            />

            <View style={biggySoulTextBlock}>
              <Text
                style={[
                  biggySoulTitle,
                  isSmallDeviceBiggySoul ? { fontSize: 22 } : { fontSize: 26 },
                ]}
              >
                {bigFinCurrent.title}
              </Text>

              <Text
                style={[
                  biggySoulDesc,
                  isSmallDeviceBiggySoul ? { fontSize: 15 } : { fontSize: 18 },
                ]}
              >
                {bigFinCurrent.description}
              </Text>
            </View>

            <View style={biggySoulBtnRow}>
              <TouchableOpacity activeOpacity={0.7} onPress={bigFinGoToNext}>
                <LinearGradient
                  colors={['#B8D0FF', '#E9B3FF', '#DC35F4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={biggySoulBtnOuter}
                >
                  <LinearGradient
                    colors={['#3B43CB', '#944DD4', '#D058D0']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                      biggySoulBtnBorder,
                      { padding: Platform.OS === 'ios' ? 2 : 0 },
                    ]}
                  >
                    <View style={biggySoulBtnInner}>
                      <Text
                        style={[
                          biggySoulBtnText,
                          isSmallDeviceBiggySoul
                            ? { fontSize: 20 }
                            : { fontSize: 24 },
                        ]}
                      >
                        {bigFinCurrent.buttonLabel}
                      </Text>

                      <Image
                        source={require('../assets/finImages/bottomStars.png')}
                        style={biggySoulBtnStars}
                      />
                    </View>
                  </LinearGradient>
                </LinearGradient>
              </TouchableOpacity>

              <View style={biggySoulDotsRow}>
                {bigFinOnboard.map((_, idx) => {
                  const active = idx === bigFinCurrentSlide;
                  return (
                    <View
                      key={idx}
                      style={[
                        biggySoulDot,
                        active ? biggySoulDotActive : biggySoulDotIdle,
                      ]}
                    />
                  );
                })}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const biggySoulRoot = { flex: 1 };

const biggySoulScroll = { flexGrow: 1 };

const biggySoulScreen = {
  flex: 1,
  alignItems: 'center' as const,
  paddingBottom: 30,
};

const biggySoulCardWrap = {
  flex: 1,
  justifyContent: 'center' as const,
  marginTop: 10,
  width: '86%',
  alignSelf: 'center' as const,
};

const biggySoulCardFrame = {
  alignSelf: 'center' as const,
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  width: '100%',
  height: '100%',
};

const biggySoulSlideImage = {
  width: '100%',
  height: 360,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  overflow: 'hidden' as const,
};

const biggySoulTextBlock = {
  paddingHorizontal: 18,
  paddingTop: 14,
  paddingBottom: 8,
  alignItems: 'center' as const,
};

const biggySoulTitle = {
  fontWeight: '900' as const,
  color: '#FDEB57',
  textAlign: 'center' as const,
};

const biggySoulDesc = {
  marginTop: 10,
  color: '#FFFFFF',
  textAlign: 'center' as const,
  lineHeight: 24,
  paddingHorizontal: 6,
};

const biggySoulBtnRow = {
  marginTop: 8,
  alignItems: 'center' as const,
  paddingBottom: 18,
};

const biggySoulBtnOuter = {
  marginTop: 10,
  width: 240,
  alignSelf: 'center' as const,
  borderRadius: 16,
  marginBottom: 3,
};

const biggySoulBtnBorder = {
  borderRadius: 16,
  width: '100%',
};

const biggySoulBtnInner = {
  padding: 12,
  paddingVertical: 16,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  borderRadius: 16,
};

const biggySoulBtnText = {
  fontWeight: '900' as const,
  color: '#FDEB57',
};

const biggySoulBtnStars = {
  position: 'absolute' as const,
  width: '100%',
  height: 54,
  zIndex: -1,
};

const biggySoulDotsRow = {
  flexDirection: 'row' as const,
  gap: 8,
  marginTop: 14,
};

const biggySoulDot = {
  width: 8,
  height: 8,
  borderRadius: 999,
};

const biggySoulDotActive = {
  backgroundColor: '#FDEB57',
  transform: [{ scale: 1.15 }],
};

const biggySoulDotIdle = {
  backgroundColor: 'rgba(253,235,87,0.35)',
};
