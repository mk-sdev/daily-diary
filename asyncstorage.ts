import AsyncStorage from '@react-native-async-storage/async-storage'

export async function getNote(key: string) {
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

export async function removeNote(key: string) {
  try {
    await AsyncStorage.removeItem(key)
    console.log('The key has been deleted successfully: ', key)
  } catch (e) {
    console.log('An error occurred while removing the key:', e)
  }
}

export async function saveNote(
  key: string,
  newValue: { date: string; text: string }
) {
  try {
    const existingNotes = (await getNote(key)) || []

    // Szukamy, czy istnieje notatka z tą samą datą
    const index = existingNotes.findIndex(
      (note: { date: string }) => note.date === newValue.date
    )

    if (index !== -1) {
      // Nadpisujemy istniejący wpis
      existingNotes[index] = newValue
    } else {
      // Dodajemy nowy
      existingNotes.unshift(newValue)
    }

    await AsyncStorage.setItem(key, JSON.stringify(existingNotes))
    console.log('New value has been set successfully:', key, newValue)
  } catch (e) {
    console.log('An error occurred while setting the key:', e)
  }
}
