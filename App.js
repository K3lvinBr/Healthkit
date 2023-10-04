import { StatusBar, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import AppleHealthKit from 'react-native-health'
import { useEffect, useState } from 'react';

const permissions = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.HeartRate],
    write: [AppleHealthKit.Constants.Permissions.Steps],
  },
}

export default function App() {

  const [hasPermissions, setHasPermissions] = useState(false)
  const [steps, setSteps] = useState(0)
  const [heart, setHeart] = useState([])
  const [sleep, setSleep] = useState([])

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

    AppleHealthKit.getHeartRateSamples(
      options,
      (error, results) => {
        if (error) {
          console.log('Error getting the heart samples')
        }
        console.log(results.value)
        setHeart(results.value[0].value)
      },
    )

    AppleHealthKit.getSleepSamples(
      options,
      (error, results) => {
        if (error) {
          console.log('Error getting the sleep samples')
        }
        console.log(results.value)

        function getMinutesBetweenDates(startDate, endDate) {
          var diff = endDate.getTime() - startDate.getTime();
          return (diff / 60000);
        }

        const start = Date.parse(results.value[0].startDate);
        const end = Date.parse(results.value[0].endDate);

        setHeart(getMinutesBetweenDates(start, end))
      },
    )



  }, [hasPermissions])

  return (
    <>
      <StatusBar translucent hidden backgroundColor='transparent' />
      <WebView
        style={styles.container}
        source={{ uri: 'https://app.umanu.com.br/' }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});