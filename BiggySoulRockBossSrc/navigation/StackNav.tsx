import { createStackNavigator } from '@react-navigation/stack';
import { BigFinCriticTestScreen } from '../screens/BigFinCriticTestScreen';
import { BigFinTapGame } from '../screens/BigFinTapGame';

import BigFinLoaderScreen from '../screens/BigFinLoaderScreen';
import BigFinHomeScreen from '../screens/BigFinHomeScreen';
import BigFinPartyZoneScreen from '../screens/BigFinPartyZoneScreen';
import BigFinCriticLevelsScreen from '../screens/BigFinCriticLevelsScreen';
import BigFinStoriesScreen from '../screens/BigFinStoriesScreen';
import IntroduceScreen from '../screens/IntroduceScreen';

const FinStack = createStackNavigator();

const StackNav = () => {
  return (
    <FinStack.Navigator screenOptions={{ headerShown: false }}>
      <FinStack.Screen
        name="BigFinLoaderScreen"
        component={BigFinLoaderScreen}
      />
      <FinStack.Screen name="IntroduceScreen" component={IntroduceScree} />
      <FinStack.Screen name="BigFinHomeScreen" component={BigFinHomeScreen} />
      <FinStack.Screen
        name="BigFinCriticLevelsScreen"
        component={BigFinCriticLevelsScreen}
      />
      <FinStack.Screen
        name="BigFinCriticTestScreen"
        component={BigFinCriticTestScreen}
      />
      <FinStack.Screen name="BigFinTapGame" component={BigFinTapGame} />
      <FinStack.Screen
        name="BigFinStoriesScreen"
        component={BigFinStoriesScreen}
      />
      <FinStack.Screen
        name="BigFinPartyZoneScreen"
        component={BigFinPartyZoneScreen}
      />
    </FinStack.Navigator>
  );
};

export default StackNav;
