import AsyncStorage from '@react-native-async-storage/async-storage'

export async function getValue(key: string) {
  try {
    const existingValue = await AsyncStorage.getItem(key)

    if (existingValue) {
      const savedValue = JSON.parse(existingValue)
      return savedValue
    } else {
      return null
    }
  } catch (error) {
    //remove the key if it hasn't been found
    // removeItemValue(key)
    console.error('Could not get the item: ', error, key)
    return null // return null in case of an error
  }
}

export async function removeItem(key: string) {
  try {
    await AsyncStorage.removeItem(key)
    console.log('The key has been deleted successfully: ', key)
  } catch (e) {
    console.log('An error occurred while removing the key:', e)
  }
}

export async function addItem(key: string, newValue: any) {
  try {
    const existingNotes = await getValue(key)
    if (existingNotes) {
      existingNotes.push(newValue)
      await AsyncStorage.setItem(key, JSON.stringify(existingNotes))
    } else await AsyncStorage.setItem(key, JSON.stringify([newValue]))

    console.log('New value has been set successfully: ', key, newValue)
  } catch (e) {
    console.log('An error occurred while setting the key: ', e)
  }
}
