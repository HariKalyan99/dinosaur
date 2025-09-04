import { AntDesign } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { FC } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Colors } from '../constants/colors'

interface CustomHeaderProps {
    title: string,
    onInfoPress?: () => void
}

const CustomHeader: FC<CustomHeaderProps> = ({title, onInfoPress}) => {
 
    const router = useRouter();

    return (
    <View className='flex flex-row items-center justify-between mt-10'>
      <TouchableOpacity onPress={() => router.back()}>
        <AntDesign name='arrowleft' color={Colors.text} size={25}/>
      </TouchableOpacity>
        <Text className='text-xl text-white'>
            Add Dyno
        </Text>
        <TouchableOpacity onPress={onInfoPress}>
            <AntDesign name='info' color={Colors.disabled} size={25}/>
        </TouchableOpacity>
    </View>
  )
}

export default CustomHeader