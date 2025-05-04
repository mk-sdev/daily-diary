import AsyncStorage from '@react-native-async-storage/async-storage'

type Note = { date: string; text: string }

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

export async function removeNote(date: string) {
  try {
    const existingNotes = await getNote('notes')

    const updatedNotes = existingNotes.filter(
      (note: Note) => note.date !== date
    )

    // Zapisujemy zaktualizowaną tablicę do AsyncStorage
    await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes))
    console.log('The note has been deleted successfully: ', date)
  } catch (e) {
    console.log('An error occurred while removing the date:', e)
  }
}


export async function saveNote(newValue: Note) {
  try {
    const existingNotes = (await getNote('notes')) || []

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

    await AsyncStorage.setItem('notes', JSON.stringify(existingNotes))
    console.log('New value has been set successfully:', 'notes', newValue)
  } catch (e) {
    console.log('An error occurred while setting the key:', e)
  }
}
