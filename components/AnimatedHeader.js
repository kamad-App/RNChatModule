import React from 'react';
import { Animated, View ,Image} from 'react-native';
import { Item } from 'react-native-paper/lib/typescript/components/List/List';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HEADER_HEIGHT = 150;
const AnimatedHeader = ({ animatedValue }) => {
    const insets = useSafeAreaInsets();

    const headerHeight = animatedValue.interpolate({
        inputRange: [-10, HEADER_HEIGHT + insets.top],
        outputRange: [HEADER_HEIGHT + insets.top, insets.top + 44],
        extrapolate: 'clamp'
      });
 
      return (
        <Animated.Image
        source={require('../images/img.jpeg')}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            height: headerHeight,
            // backgroundColor: 'red'
          }}
        >
        </Animated.Image>
      );
 
};

export default AnimatedHeader;