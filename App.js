import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
} from 'react-native-health'

const permissions = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.HeartRate],
    write: [AppleHealthKit.Constants.Permissions.Steps],
  },
}

export default function App() {

  const [hasPermissions, setHasPermissions] = useState(false)
  const [steps, setSteps] = useState(0)

  useEffect(() => {
    if (Platform.OS === 'ios') {
      AppleHealthKit.initHealthKit(permissions, (error) => {
        if (error) {
          console.log('[ERROR] Cannot grant permissions!')
          return
        }
        setHasPermissions(true)
      })
    }
  }, [])

  useEffect(() => {
    if (!hasPermissions) {
      return
    }

    const options = {
      startDate: new Date().toISOString(),
      includeManuallyAdded: false
    }

    AppleHealthKit.getStepCount(
      options,
      (error, results) => {
        if (error) {
          console.log('Error getting the steps')
        }
        console.log(results.value)
        setSteps(results.value)
      },
    )

  }, [hasPermissions])

  return (
    <View style={styles.container}>
      <Text>{steps.toString()}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
