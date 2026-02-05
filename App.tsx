import { NavigationContainer } from '@react-navigation/native';

import { ContextProvider } from './BiggySoulRockBossSrc/storage/bigFinCntxt';
import StackNav from './BiggySoulRockBossSrc/navigation/StackNav';

const App = () => {
  return (
    <NavigationContainer>
      <ContextProvider>
        <StackNav />
      </ContextProvider>
    </NavigationContainer>
  );
};

export default App;
