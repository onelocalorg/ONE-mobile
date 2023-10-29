import React, {useEffect} from 'react';
import {queryConfig} from '@network/utils/query-config';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {getTheme} from './theme';
import {light} from '@assets/constants';
import {Provider} from 'react-redux';
import {StatusBar} from 'react-native';
import {store} from '@network/reducers/store';
import {InternetConnectionHandle} from '@utils/internet-connection-handle';
import {AppNavigation} from '@config/app-navigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {initializeStripe} from '@utils/stripe';
import {useToken} from '@app-hooks/use-token';
import axios from 'axios';
import {API} from '@network/api';
import {StripeProvider} from '@stripe/stripe-react-native';
import ActiveEnv from '@config/env/env.json';

export const queryClient = new QueryClient(queryConfig);
const theme = getTheme(light);

export const App = () => {
  const {token} = useToken();

  useEffect(() => {
    initializeStripe();
  }, []);

  useEffect(() => {
    console.log('Hi');
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      API.initService();
    }
  }, [token]);

  return (
    <StripeProvider publishableKey={ActiveEnv.STRIPE_PUBLISHABLE_KEY}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <InternetConnectionHandle />
            <StatusBar
              barStyle="dark-content"
              backgroundColor={theme.colors.black}
            />
            <AppNavigation />
          </Provider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </StripeProvider>
  );
};
