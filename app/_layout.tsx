import { useColorScheme } from '@/hooks/useColorScheme'
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as Updates from 'expo-updates'
import { useEffect } from 'react'
import { Alert } from 'react-native'
import 'react-native-reanimated'

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const update = await Updates.checkForUpdateAsync()
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync()
          Alert.alert(
            'Aktualizacja dostępna',
            'Aplikacja zostanie zrestartowana, aby zastosować nową wersję.',
            [
              {
                text: 'OK',
                onPress: () => Updates.reloadAsync(),
              },
            ]
          )
        }
      } catch (e) {
        console.log('Błąd aktualizacji:', e)
      }
    }

    checkForUpdates()
  }, [])

  if (!loaded) {
    // Async font loading only occurs in development.
    return null
  }
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}
