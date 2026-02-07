import { createStackNavigator } from '@react-navigation/stack';
import { BigFinCriticTestScreen } from '../screens/BigFinCriticTestScreen';
import { BigFinTapGame } from '../screens/BigFinTapGame';

import BigFinLoaderScreen from '../screens/BigFinLoaderScreen';
import BigFinHomeScreen from '../screens/BigFinHomeScreen';
import BigFinPartyZoneScreen from '../screens/BigFinPartyZoneScreen';
import BigFinCriticLevelsScreen from '../screens/BigFinCriticLevelsScreen';
import BigFinStoriesScreen from '../screens/BigFinStoriesScreen';
import IntroduceScreen from '../screens/IntroduceScreen';

const Stack = createStackNavigator();

const StackNav = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BigFinLoaderScreen" component={BigFinLoaderScreen} />
      <Stack.Screen name="IntroduceScreen" component={IntroduceScreen} />
      <Stack.Screen name="BigFinHomeScreen" component={BigFinHomeScreen} />
      <Stack.Screen
        name="BigFinCriticLevelsScreen"
        component={BigFinCriticLevelsScreen}
      />
      <Stack.Screen
        name="BigFinCriticTestScreen"
        component={BigFinCriticTestScreen}
      />
      <Stack.Screen name="BigFinTapGame" component={BigFinTapGame} />
      <Stack.Screen
        name="BigFinStoriesScreen"
        component={BigFinStoriesScreen}
      />
      <Stack.Screen
        name="BigFinPartyZoneScreen"
        component={BigFinPartyZoneScreen}
      />
    </Stack.Navigator>
  );
};

export default StackNav;
