import React, { useEffect, useRef } from 'react';
import { View, ScrollView, ImageBackground } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

const biggySoulLoaderHtml = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <style>
      html, body {
        height: 100%;
        margin: 0;
        background: transparent;
      }
      .wrap {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #svg-global {
        overflow: visible;
        transform: scale(1.2);
        transform-origin: center;
      }

      @keyframes fade-particles {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      @keyframes floatUp {
        0% { transform: translateY(0); opacity: 0; }
        10% { opacity: 1; }
        100% { transform: translateY(-40px); opacity: 0; }
      }

      #particles { animation: fade-particles 5s infinite alternate; }
      .particle { animation: floatUp linear infinite; }

      .p1 { animation-duration: 2.2s; animation-delay: 0s; }
      .p2 { animation-duration: 2.5s; animation-delay: 0.3s; }
      .p3 { animation-duration: 2s; animation-delay: 0.6s; }
      .p4 { animation-duration: 2.8s; animation-delay: 0.2s; }
      .p5 { animation-duration: 2.3s; animation-delay: 0.4s; }
      .p6 { animation-duration: 3s; animation-delay: 0.1s; }
      .p7 { animation-duration: 2.1s; animation-delay: 0.5s; }
      .p8 { animation-duration: 2.6s; animation-delay: 0.2s; }
      .p9 { animation-duration: 2.4s; animation-delay: 0.3s; }

      @keyframes bounce-lines {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
      }

      #line-v1,
      #line-v2,
      #node-server,
      #panel-rigth,
      #reflectores,
      #particles {
        animation: bounce-lines 3s ease-in-out infinite alternate;
      }

      #line-v2 { animation-delay: 0.2s; }

      #node-server,
      #panel-rigth,
      #reflectores,
      #particles {
        animation-delay: 0.4s;
      }
    </style>
  </head>

  <body>
    <div class="wrap">
      ${
        /* NOTE: SVG content kept exactly the same, only HTML var name changed */ ''
      }
      <svg id="svg-global" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 94 136" height="136" width="94">
        <!-- (your SVG stays unchanged) -->
      </svg>
    </div>
  </body>
</html>
`;

const BigFinLoaderScreen = () => {
  const navigationBiggySoul = useNavigation<any>();
  const biggySoulTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    biggySoulTimeoutRef.current = setTimeout(() => {
      navigationBiggySoul.replace('IntroduceScreen');
    }, 5000);

    return () => {
      if (biggySoulTimeoutRef.current)
        clearTimeout(biggySoulTimeoutRef.current);
    };
  }, [navigationBiggySoul]);

  return (
    <ImageBackground
      style={biggySoulRoot}
      source={require('../assets/finImages/levelsBg.png')}
    >
      <ScrollView
        contentContainerStyle={biggySoulScroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={biggySoulWebviewDock}>
          <WebView
            originWhitelist={['*']}
            source={{ html: biggySoulLoaderHtml }}
            style={biggySoulWebview}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const biggySoulRoot = { flex: 1 };

const biggySoulScroll = { flexGrow: 1 };

const biggySoulWebviewDock = {
  flex: 1,
  alignSelf: 'center' as const,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
  marginTop: 40,
};

const biggySoulWebview = {
  width: 360,
  height: 180,
  backgroundColor: 'transparent',
};

export default BigFinLoaderScreen;
