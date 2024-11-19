import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

export default function HealthMetrics() {
  const [heartRate, setHeartRate] = useState(new Array(10).fill(0)); 
  const [spo2, setSpO2] = useState(new Array(10).fill(0));
  const [currentHeartRate, setCurrentHeartRate] = useState(0);
  const [currentSpO2, setCurrentSpO2] = useState(0);

  useEffect(() => {
    const generateRandomData = () => {
      const newHeartRate = Array.from({ length: 10 }, () =>
        Math.floor(Math.random() * (120 - 60 + 1) + 60)
      );
      const newSpO2 = Array.from({ length: 10 }, () =>
        Math.floor(Math.random() * (100 - 95 + 1) + 95)
      );

      if (
        newHeartRate.some(value => isNaN(value) || !isFinite(value)) ||
        newSpO2.some(value => isNaN(value) || !isFinite(value))
      ) {
        console.warn("Invalid data detected");
        return;
      }

      setHeartRate(newHeartRate);
      setSpO2(newSpO2);
      setCurrentHeartRate(newHeartRate[newHeartRate.length - 1]);
      setCurrentSpO2(newSpO2[newSpO2.length - 1]);
    };

    generateRandomData();
    const interval = setInterval(generateRandomData, 5000);
    return () => clearInterval(interval);
  }, []);

  const screenWidth = Dimensions.get('window').width || 300;

  if (!heartRate.length || !spo2.length) {
    return (
      <View style={styles.container}>
        <Text>Loading charts...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Health Metrics</Text>
        <View style={styles.currentValues}>
          <Text style={styles.metric}>
            Current Heart Rate: <Text style={styles.value}>{currentHeartRate} bpm</Text>
          </Text>
          <Text style={styles.metric}>
            Current SpO2: <Text style={styles.value}>{currentSpO2}%</Text>
          </Text>
        </View>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Heart Rate</Text>
          <LineChart
            data={{
              labels: Array.from({ length: 10 }, (_, i) => `${i + 1}`),
              datasets: [{ data: heartRate }],
            }}
            width={screenWidth - 40}
            height={200}
            yAxisSuffix=" bpm"
            chartConfig={{
              backgroundColor: '#003366',
              backgroundGradientFrom: '#003366',
              backgroundGradientTo: '#00509E',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            bezier
            style={styles.chart}
          />

          <Text style={styles.chartTitle}>SpO2</Text>
          <LineChart
            data={{
              labels: Array.from({ length: 10 }, (_, i) => `${i + 1}`),
              datasets: [{ data: spo2 }],
            }}
            width={screenWidth - 40}
            height={200}
            yAxisSuffix=" %"
            chartConfig={{
              backgroundColor: '#003366',
              backgroundGradientFrom: '#003366',
              backgroundGradientTo: '#00509E',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5dc',
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#003366',
  },
  currentValues: {
    marginBottom: 20,
    alignItems: 'center',
  },
  metric: {
    fontSize: 18,
    color: '#003366',
    marginBottom: 5,
  },
  value: {
    fontWeight: 'bold',
    color: '#000',
  },
  chartContainer: {
    width: '100%',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
