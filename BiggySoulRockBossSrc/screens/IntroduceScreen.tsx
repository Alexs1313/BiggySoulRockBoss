import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Image,
  ScrollView,
  StyleSheet,
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
  const navigation = useNavigation();
  const [bigFinCurrentSlide, setBigFinCurrentSlide] = useState(0);
  const { width: w, height: h } = useWindowDimensions();
  const isSDevice = h < 700;
  const isMDevice = h >= 700 && h < 800;

  const bigFinGoToNext = () => {
    if (bigFinCurrentSlide === 5) {
      navigation.navigate('BigFinHomeScreen');
      return;
    }
    setBigFinCurrentSlide(previousSlide => previousSlide + 1);
  };

  const bigFinCurrent = bigFinOnboard[bigFinCurrentSlide];

  return (
    <View style={bigFinStyles.bigFinContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={bigFinStyles.bigFinScrollContainer}
        bounces={false}
      >
        <View style={bigFinStyles.bigFinImageWrapper}>
          <Image
            source={bigFinCurrent.image}
            style={[
              bigFinStyles.bigFinImage,
              isSDevice
                ? { height: 450 }
                : isMDevice
                ? { height: 520 }
                : { height: 600 },
            ]}
          />
          <LinearGradient
            colors={['#10063D00', '#061468ff']}
            style={bigFinStyles.bigFinGradient}
          />
        </View>

        <View style={bigFinStyles.bigFinTextContainer}>
          <Text
            style={[
              bigFinStyles.bigFinTitle,
              { fontSize: isSDevice ? 24 : isMDevice ? 28 : 32 },
            ]}
          >
            {bigFinCurrent.title}
          </Text>
          <Text
            style={[
              bigFinStyles.bigFinDescription,
              { fontSize: isSDevice ? 15 : 20 },
            ]}
          >
            {bigFinCurrent.description}
          </Text>
        </View>

        <View style={bigFinStyles.bigFinButtonContainer}>
          <TouchableOpacity activeOpacity={0.7} onPress={bigFinGoToNext}>
            <LinearGradient
              colors={['#FE9200', '#FDEF70', '#FD3213']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[bigFinStyles.bigFinButton, { width: w * 0.5 }]}
            >
              <Text
                style={[
                  bigFinStyles.bigFinButtonText,
                  { fontSize: isSDevice ? 20 : 24 },
                ]}
              >
                {[bigFinCurrent.buttonLabel]}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const bigFinStyles = StyleSheet.create({
  bigFinContainer: {
    flex: 1,
    backgroundColor: '#061468ff',
  },
  bigFinScrollContainer: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  bigFinImageWrapper: {
    width: '100%',
  },
  bigFinImage: {
    width: '100%',
    height: 600,
  },
  bigFinGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 130,
  },
  bigFinTextContainer: {
    marginTop: -50,
    paddingHorizontal: 20,
  },
  bigFinTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
  },
  bigFinDescription: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 30,
  },
  bigFinButtonContainer: {
    alignItems: 'center',
    marginTop: 30,
    flex: 1,
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  bigFinButton: {
    width: 216,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  bigFinButtonText: {
    color: '#10063D',
    fontSize: 24,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  bigFinStars: {
    width: '100%',
    height: 100,
    position: 'absolute',
    bottom: 0,
  },
});
