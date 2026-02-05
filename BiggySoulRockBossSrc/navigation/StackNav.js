import { createStackNavigator } from '@react-navigation/stack';
import { BigFinCriticTestScreen } from '../bigFinViews/BigFinCriticTestScreen';
import { BigFinTapGame } from '../bigFinViews/BigFinTapGame';

import BigFinLoaderScreen from '../bigFinViews/BigFinLoaderScreen';
import BigFinHomeScreen from '../bigFinViews/BigFinHomeScreen';
import BigFinPartyZoneScreen from '../bigFinViews/BigFinPartyZoneScreen';
import BigFinCriticLevelsScreen from '../bigFinViews/BigFinCriticLevelsScreen';
import BigFinStoriesScreen from '../bigFinViews/BigFinStoriesScreen';
import IntroduceScreen from '../bigFinViews/IntroduceScreen';

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
