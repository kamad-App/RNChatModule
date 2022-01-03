import React, {useState,useRef} from 'react';
import {View, Text, StyleSheet,ScrollView, Button, TouchableOpacity,Animated} from 'react-native';
import {FlatList, TextInput} from 'react-native-gesture-handler';
import {normalize, vh, vw} from '../dimensions';
import LottieView from 'lottie-react-native';
import {SafeAreaProvider,SafeAreaView} from 'react-native-safe-area-context';
import AnimatedHeader from '../components/AnimatedHeader';
const DATA = [
  {
    id: 1,
    title: 'The Hunger Games'
  },
  {
    id: 2,
    title: 'Harry Potter and the Order of the Phoenix'
  },
  {
    id: 3,
    title: 'To Kill a Mockingbird'
  },
  {
    id: 4,
    title: 'Pride and Prejudice'
  },
  {
    id: 5,
    title: 'Twilight'
  },
  {
    id: 6,
    title: 'The Book Thief'
  },
  {
    id: 7,
    title: 'The Chronicles of Narnia'
  },
  {
    id: 8,
    title: 'Animal Farm'
  },
  {
    id: 9,
    title: 'Gone with the Wind'
  },
  {
    id: 10,
    title: 'The Shadow of the Wind'
  },
  {
    id: 11,
    title: 'The Fault in Our Stars'
  },
  {
    id: 12,
    title: "The Hitchhiker's Guide to the Galaxy"
  },
  {
    id: 13,
    title: 'The Giving Tree'
  },
  {
    id: 14,
    title: 'Wuthering Heights'
  },
  {
    id: 15,
    title: 'The Da Vinci Code'
  }
];
const payment = () => {
  const offset = useRef(new Animated.Value(0)).current;
  
  
  return (
    <SafeAreaProvider style={styles.container}>
     <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always' }}>
     <AnimatedHeader animatedValue={offset} />
     <ScrollView
          style={{ flex: 1, backgroundColor: 'white' }}
          contentContainerStyle={{
            alignItems: 'center',
            paddingTop: 220,
            paddingHorizontal: 20
          }}
          
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={6}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: offset } } }],
            { useNativeDriver: false }
          )}
        >
           {DATA.map(item => (
            <View
              key={item.id}
              style={{
                marginBottom: 20
              }}
            >
              <Text style={{ color: '#101010', fontSize: 32 }}>
                {item.title}
              </Text>
            </View>
          ))}
          </ScrollView>
        
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  FlatList: {
    padding: 20,
  },
  FlatList2: {
    borderRadius: 10,
    backgroundColor: 'skyblue',
  },
});
export default payment;
