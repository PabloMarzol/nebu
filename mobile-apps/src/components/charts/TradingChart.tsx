import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LineChart, CandlestickChart } from 'react-native-chart-kit';
import { VictoryChart, VictoryLine, VictoryArea, VictoryAxis, VictoryTheme } from 'victory-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';

import { RootState, AppDispatch } from '../../store/store';
import { fetchChartData } from '../../store/slices/tradingSlice';
import { colors } from '../../theme/colors';
import { MarketDataService } from '../../services/MarketDataService';

const { width, height } = Dimensions.get('window');

interface ChartData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TradingChartProps {
  symbol: string;
  timeframe: string;
  style?: any;
}

export const TradingChart: React.FC<TradingChartProps> = ({ 
  symbol, 
  timeframe, 
  style 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { chartData, isLoading } = useSelector((state: RootState) => state.trading);
  
  const [chartType, setChartType] = useState<'line' | 'candlestick' | 'area'>('line');
  const [indicators, setIndicators] = useState<string[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [touchData, setTouchData] = useState<any>(null);
  const [priceData, setPriceData] = useState<ChartData[]>([]);
  const [technicalIndicators, setTechnicalIndicators] = useState<any>({});
  
  const chartRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    loadChartData();
    connectWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [symbol, timeframe]);

  const loadChartData = async () => {
    try {
      const data = await MarketDataService.getChartData(symbol, timeframe);
      setPriceData(data);
      
      // Calculate technical indicators
      const indicators = await MarketDataService.getTechnicalIndicators(symbol, timeframe);
      setTechnicalIndicators(indicators);
    } catch (error) {
      console.error('Failed to load chart data:', error);
      Alert.alert('Error', 'Failed to load chart data');
    }
  };

  const connectWebSocket = () => {
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${timeframe}`;
    wsRef.current = new WebSocket(wsUrl);
    
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.k) {
        const newCandle: ChartData = {
          timestamp: data.k.t,
          open: parseFloat(data.k.o),
          high: parseFloat(data.k.h),
          low: parseFloat(data.k.l),
          close: parseFloat(data.k.c),
          volume: parseFloat(data.k.v),
        };
        
        setPriceData(prev => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          
          if (updated[lastIndex]?.timestamp === newCandle.timestamp) {
            updated[lastIndex] = newCandle;
          } else {
            updated.push(newCandle);
          }
          
          return updated.slice(-200); // Keep last 200 candles
        });
      }
    };
    
    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  const calculateMA = (data: ChartData[], period: number) => {
    return data.map((_, index) => {
      if (index < period - 1) return null;
      
      const sum = data.slice(index - period + 1, index + 1)
        .reduce((acc, curr) => acc + curr.close, 0);
      return sum / period;
    });
  };

  const calculateEMA = (data: ChartData[], period: number) => {
    const multiplier = 2 / (period + 1);
    const ema = [data[0].close];
    
    for (let i = 1; i < data.length; i++) {
      const emaValue = (data[i].close - ema[i - 1]) * multiplier + ema[i - 1];
      ema.push(emaValue);
    }
    
    return ema;
  };

  const calculateRSI = (data: ChartData[], period: number = 14) => {
    const changes = data.slice(1).map((curr, index) => curr.close - data[index].close);
    const gains = changes.map(change => change > 0 ? change : 0);
    const losses = changes.map(change => change < 0 ? Math.abs(change) : 0);
    
    const rsi = [];
    for (let i = period - 1; i < gains.length; i++) {
      const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b) / period;
      const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b) / period;
      
      if (avgLoss === 0) {
        rsi.push(100);
      } else {
        const rs = avgGain / avgLoss;
        rsi.push(100 - (100 / (1 + rs)));
      }
    }
    
    return rsi;
  };

  const formatPrice = (price: number) => {
    return price.toFixed(6);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getChartColor = () => {
    if (priceData.length < 2) return colors.primary;
    const current = priceData[priceData.length - 1];
    const previous = priceData[priceData.length - 2];
    return current.close > previous.close ? colors.success : colors.error;
  };

  const renderLineChart = () => {
    if (!priceData.length) return null;
    
    const data = priceData.map(item => item.close);
    const labels = priceData.map(item => formatTime(item.timestamp));
    
    return (
      <LineChart
        data={{
          labels: labels.slice(-20), // Show last 20 labels
          datasets: [
            {
              data: data.slice(-20),
              color: (opacity = 1) => getChartColor() + Math.round(opacity * 255).toString(16),
              strokeWidth: 2,
            },
          ],
        }}
        width={width - 32}
        height={220}
        yAxisLabel="$"
        yAxisSuffix=""
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: colors.surface,
          backgroundGradientFrom: colors.surface,
          backgroundGradientTo: colors.surface,
          decimalPlaces: 2,
          color: (opacity = 1) => colors.text + Math.round(opacity * 255).toString(16),
          labelColor: (opacity = 1) => colors.textSecondary + Math.round(opacity * 255).toString(16),
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "3",
            strokeWidth: "2",
            stroke: colors.primary,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        onDataPointClick={(data) => {
          setTouchData({
            index: data.index,
            value: data.value,
            x: data.x,
            y: data.y,
          });
        }}
      />
    );
  };

  const renderAreaChart = () => {
    if (!priceData.length) return null;
    
    const chartData = priceData.map((item, index) => ({
      x: index,
      y: item.close,
      timestamp: item.timestamp,
    }));
    
    return (
      <VictoryChart
        theme={VictoryTheme.material}
        height={220}
        width={width - 32}
        padding={{ left: 60, top: 20, right: 20, bottom: 40 }}
        domain={{
          y: [
            Math.min(...priceData.map(d => d.low)) * 0.995,
            Math.max(...priceData.map(d => d.high)) * 1.005,
          ],
        }}
      >
        <VictoryArea
          data={chartData}
          style={{
            data: {
              fill: colors.primary + '40',
              stroke: colors.primary,
              strokeWidth: 2,
            },
          }}
          animate={{
            duration: 1000,
            onLoad: { duration: 500 },
          }}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(t) => `$${t.toFixed(2)}`}
          style={{
            axis: { stroke: colors.border },
            tickLabels: { fill: colors.textSecondary, fontSize: 12 },
            grid: { stroke: colors.border + '40' },
          }}
        />
        <VictoryAxis
          tickFormat={() => ''}
          style={{
            axis: { stroke: colors.border },
            tickLabels: { fill: colors.textSecondary, fontSize: 12 },
          }}
        />
      </VictoryChart>
    );
  };

  const renderCandlestickChart = () => {
    if (!priceData.length) return null;
    
    return (
      <View style={styles.candlestickContainer}>
        {priceData.slice(-20).map((candle, index) => {
          const isGreen = candle.close > candle.open;
          const bodyHeight = Math.abs(candle.close - candle.open);
          const wickTop = Math.max(candle.high - Math.max(candle.open, candle.close), 0);
          const wickBottom = Math.max(Math.min(candle.open, candle.close) - candle.low, 0);
          
          return (
            <View key={index} style={styles.candlestick}>
              <View
                style={[
                  styles.wick,
                  {
                    height: wickTop * 100,
                    backgroundColor: isGreen ? colors.success : colors.error,
                  },
                ]}
              />
              <View
                style={[
                  styles.body,
                  {
                    height: bodyHeight * 100,
                    backgroundColor: isGreen ? colors.success : colors.error,
                  },
                ]}
              />
              <View
                style={[
                  styles.wick,
                  {
                    height: wickBottom * 100,
                    backgroundColor: isGreen ? colors.success : colors.error,
                  },
                ]}
              />
            </View>
          );
        })}
      </View>
    );
  };

  const renderTechnicalIndicators = () => {
    if (!indicators.length || !priceData.length) return null;
    
    return (
      <View style={styles.indicatorsContainer}>
        {indicators.includes('ma20') && (
          <VictoryLine
            data={calculateMA(priceData, 20).map((value, index) => ({
              x: index,
              y: value,
            }))}
            style={{
              data: { stroke: colors.warning, strokeWidth: 1 },
            }}
          />
        )}
        {indicators.includes('ma50') && (
          <VictoryLine
            data={calculateMA(priceData, 50).map((value, index) => ({
              x: index,
              y: value,
            }))}
            style={{
              data: { stroke: colors.info, strokeWidth: 1 },
            }}
          />
        )}
        {indicators.includes('ema12') && (
          <VictoryLine
            data={calculateEMA(priceData, 12).map((value, index) => ({
              x: index,
              y: value,
            }))}
            style={{
              data: { stroke: colors.primary, strokeWidth: 1 },
            }}
          />
        )}
      </View>
    );
  };

  const toggleIndicator = (indicator: string) => {
    setIndicators(prev => 
      prev.includes(indicator) 
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading chart data...</Text>
      </View>
    );
  }

  return (
    <Animatable.View animation="fadeIn" style={[styles.container, style]}>
      {/* Chart Header */}
      <View style={styles.header}>
        <View style={styles.symbolInfo}>
          <Text style={styles.symbol}>{symbol}</Text>
          <Text style={styles.timeframe}>{timeframe}</Text>
        </View>
        
        {priceData.length > 0 && (
          <View style={styles.priceInfo}>
            <Text style={styles.currentPrice}>
              ${formatPrice(priceData[priceData.length - 1].close)}
            </Text>
            <Text style={[
              styles.priceChange,
              { color: getChartColor() }
            ]}>
              {priceData.length > 1 ? (
                (priceData[priceData.length - 1].close - priceData[priceData.length - 2].close) > 0 ? '+' : ''
              ) : ''}
              {priceData.length > 1 ? 
                (priceData[priceData.length - 1].close - priceData[priceData.length - 2].close).toFixed(6) : 
                '0.000000'
              }
            </Text>
          </View>
        )}
      </View>

      {/* Chart Type Selector */}
      <View style={styles.chartTypeSelector}>
        <TouchableOpacity
          style={[styles.chartTypeButton, chartType === 'line' && styles.activeChartType]}
          onPress={() => setChartType('line')}
        >
          <Icon name="chart-line" size={20} color={chartType === 'line' ? colors.primary : colors.textSecondary} />
          <Text style={[styles.chartTypeText, chartType === 'line' && styles.activeChartTypeText]}>
            Line
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.chartTypeButton, chartType === 'area' && styles.activeChartType]}
          onPress={() => setChartType('area')}
        >
          <Icon name="chart-areaspline" size={20} color={chartType === 'area' ? colors.primary : colors.textSecondary} />
          <Text style={[styles.chartTypeText, chartType === 'area' && styles.activeChartTypeText]}>
            Area
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.chartTypeButton, chartType === 'candlestick' && styles.activeChartType]}
          onPress={() => setChartType('candlestick')}
        >
          <Icon name="chart-box" size={20} color={chartType === 'candlestick' ? colors.primary : colors.textSecondary} />
          <Text style={[styles.chartTypeText, chartType === 'candlestick' && styles.activeChartTypeText]}>
            Candle
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chart Display */}
      <View style={styles.chartContainer}>
        {chartType === 'line' && renderLineChart()}
        {chartType === 'area' && renderAreaChart()}
        {chartType === 'candlestick' && renderCandlestickChart()}
        {renderTechnicalIndicators()}
      </View>

      {/* Technical Indicators */}
      <View style={styles.indicatorsSelector}>
        <TouchableOpacity
          style={[styles.indicatorButton, indicators.includes('ma20') && styles.activeIndicator]}
          onPress={() => toggleIndicator('ma20')}
        >
          <Text style={[styles.indicatorText, indicators.includes('ma20') && styles.activeIndicatorText]}>
            MA20
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.indicatorButton, indicators.includes('ma50') && styles.activeIndicator]}
          onPress={() => toggleIndicator('ma50')}
        >
          <Text style={[styles.indicatorText, indicators.includes('ma50') && styles.activeIndicatorText]}>
            MA50
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.indicatorButton, indicators.includes('ema12') && styles.activeIndicator]}
          onPress={() => toggleIndicator('ema12')}
        >
          <Text style={[styles.indicatorText, indicators.includes('ema12') && styles.activeIndicatorText]}>
            EMA12
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.indicatorButton, indicators.includes('rsi') && styles.activeIndicator]}
          onPress={() => toggleIndicator('rsi')}
        >
          <Text style={[styles.indicatorText, indicators.includes('rsi') && styles.activeIndicatorText]}>
            RSI
          </Text>
        </TouchableOpacity>
      </View>

      {/* Touch Data Display */}
      {touchData && (
        <Animatable.View animation="fadeIn" style={styles.touchDataContainer}>
          <Text style={styles.touchDataText}>
            Price: ${touchData.value.toFixed(6)}
          </Text>
          <Text style={styles.touchDataText}>
            Index: {touchData.index}
          </Text>
        </Animatable.View>
      )}
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    margin: 8,
  },
  loadingContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.textSecondary,
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  symbolInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  timeframe: {
    fontSize: 14,
    color: colors.textSecondary,
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  priceChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartTypeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 4,
  },
  chartTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  activeChartType: {
    backgroundColor: colors.primary + '20',
  },
  chartTypeText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  activeChartTypeText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  chartContainer: {
    minHeight: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  candlestickContainer: {
    flexDirection: 'row',
    height: 220,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  candlestick: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 8,
  },
  wick: {
    width: 2,
  },
  body: {
    width: 6,
    minHeight: 2,
  },
  indicatorsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  indicatorsSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    gap: 8,
  },
  indicatorButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeIndicator: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  indicatorText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  activeIndicatorText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  touchDataContainer: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  touchDataText: {
    fontSize: 12,
    color: colors.text,
  },
});

export default TradingChart;