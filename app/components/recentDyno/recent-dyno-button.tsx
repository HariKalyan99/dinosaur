import { Colors } from '@/app/constants/colors'
import { AntDesign } from '@expo/vector-icons'
import React from 'react'
import { Text, View } from 'react-native'

const RecentDynoButton = () => {
  return (
    <View className='flex flex-row m-4 mt-6 gap-4 items-center'>
      <Text className='text-white text-sm'>Recent</Text>
      <AntDesign name='arrowdown' size={15} color={Colors.white}/>
    </View>
  )
}

export default RecentDynoButton