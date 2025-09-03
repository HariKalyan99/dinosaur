import Dynos from '@/app/components/screenComponents/dynos';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Dynoshorts = () => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  return (
    <SafeAreaView className='flex-1'>
      <View style={{width: windowWidth, height: windowHeight}} className='bg-black relative'>
          <View className='absolute top-0 left-0 right-0 flex-row justify-between z-1 p-2'>
            <Text className='font-bold text-2xl text-white'>
              Dynos
            </Text>
            <Feather name='camera' size={25} color={"#ffffff"}/>
          </View>
          <Dynos /> 
      </View>
    </SafeAreaView>
  )
}

export default Dynoshorts