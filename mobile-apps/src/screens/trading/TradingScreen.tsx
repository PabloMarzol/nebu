import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Alert,
  RefreshControl,
  FlatList,
} from 'react-native';
import { Card, Button, TextInput, Chip, FAB, Portal, Modal } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

import { RootState, AppDispatch } from '../../store/store';
import { 
  fetchTradingPairs, 
  placeBuyOrder, 
  placeSellOrder, 
  cancelOrder,
  fetchOrderBook,
  fetchOrderHistory
} from '../../store/slices/tradingSlice';
import { fetchPortfolio } from '../../store/slices/portfolioSlice';
import { colors } from '../../theme/colors';
import { TradingChart } from '../../components/charts/TradingChart';
import { OrderBook } from '../../components/trading/OrderBook';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

interface TradingPair {
  id: string;
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
}

interface Order {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop_loss' | 'take_profit' | 'stop_limit';
  amount: number;
  price: number;
  status: 'pending' | 'filled' | 'cancelled' | 'partially_filled';
  createdAt: string;
}

const TradingScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  
  const { 
    tradingPairs, 
    orderBook, 
    orderHistory, 
    isLoading, 
    error 
  } = useSelector((state: RootState) => state.trading);
  
  const { portfolio } = useSelector((state: RootState) => state.portfolio);
  
  const [selectedPair, setSelectedPair] = useState<TradingPair | null>(null);
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop_loss' | 'take_profit' | 'stop_limit'>('market');
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [chartTimeframe, setChartTimeframe] = useState('1h');

  useEffect(() => {
    loadTradingData();
  }, []);

  const loadTradingData = useCallback(async () => {
    try {
      await dispatch(fetchTradingPairs()).unwrap();
      await dispatch(fetchPortfolio()).unwrap();
      if (selectedPair) {
        await dispatch(fetchOrderBook(selectedPair.symbol)).unwrap();
        await dispatch(fetchOrderHistory()).unwrap();
      }
    } catch (error) {
      console.error('Failed to load trading data:', error);
    }
  }, [dispatch, selectedPair]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTradingData().finally(() => setRefreshing(false));
  }, [loadTradingData]);

  const handlePlaceOrder = async () => {
    if (!selectedPair || !amount) {
      Alert.alert('Error', 'Please select a trading pair and enter amount');
      return;
    }

    if (orderType !== 'market' && !price) {
      Alert.alert('Error', 'Please enter price for limit orders');
      return;
    }

    try {
      const orderData = {
        symbol: selectedPair.symbol,
        side: orderSide,
        type: orderType,
        amount: parseFloat(amount),
        price: orderType === 'market' ? selectedPair.price : parseFloat(price),
        stopPrice: stopPrice ? parseFloat(stopPrice) : undefined,
      };

      if (orderSide === 'buy') {
        await dispatch(placeBuyOrder(orderData)).unwrap();
      } else {
        await dispatch(placeSellOrder(orderData)).unwrap();
      }

      setShowOrderModal(false);
      setAmount('');
      setPrice('');
      setStopPrice('');
      
      Alert.alert('Success', 'Order placed successfully');
      loadTradingData();
    } catch (error) {
      Alert.alert('Error', 'Failed to place order');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await dispatch(cancelOrder(orderId)).unwrap();
      Alert.alert('Success', 'Order cancelled successfully');
      loadTradingData();
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel order');
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const renderTradingPairCard = ({ item }: { item: TradingPair }) => (
    <TouchableOpacity 
      onPress={() => setSelectedPair(item)}
      style={[
        styles.pairCard,
        selectedPair?.id === item.id && styles.selectedPairCard
      ]}
    >
      <View style={styles.pairInfo}>
        <Text style={styles.pairSymbol}>{item.symbol}</Text>
        <Text style={styles.pairName}>{item.baseAsset}/{item.quoteAsset}</Text>
      </View>
      <View style={styles.pairPriceInfo}>
        <Text style={styles.pairPrice}>{formatCurrency(item.price)}</Text>
        <Text style={[
          styles.pairChange,
          { color: item.change24h >= 0 ? colors.success : colors.error }
        ]}>
          {formatPercentage(item.change24h)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderOrderCard = ({ item }: { item: Order }) => (
    <Card style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderSymbol}>{item.symbol}</Text>
          <Chip 
            mode="outlined" 
            compact
            style={[
              styles.orderSideChip,
              { backgroundColor: item.side === 'buy' ? colors.success : colors.error }
            ]}
          >
            {item.side.toUpperCase()}
          </Chip>
        </View>
        <TouchableOpacity 
          onPress={() => handleCancelOrder(item.id)}
          disabled={item.status === 'filled' || item.status === 'cancelled'}
        >
          <Icon name="close" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
      <View style={styles.orderDetails}>
        <Text style={styles.orderType}>{item.type.toUpperCase()}</Text>
        <Text style={styles.orderAmount}>Amount: {item.amount}</Text>
        <Text style={styles.orderPrice}>Price: {formatCurrency(item.price)}</Text>
        <Chip 
          mode="outlined" 
          compact
          style={[
            styles.orderStatusChip,
            { backgroundColor: getStatusColor(item.status) }
          ]}
        >
          {item.status.toUpperCase()}
        </Chip>
      </View>
    </Card>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'filled': return colors.success;
      case 'cancelled': return colors.error;
      case 'pending': return colors.warning;
      case 'partially_filled': return colors.info;
      default: return colors.surface;
    }
  };

  const OrderModal = () => (
    <Portal>
      <Modal
        visible={showOrderModal}
        onDismiss={() => setShowOrderModal(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Place Order</Text>
          
          {selectedPair && (
            <Card style={styles.selectedPairInfo}>
              <Text style={styles.selectedPairText}>
                {selectedPair.symbol} - {formatCurrency(selectedPair.price)}
              </Text>
            </Card>
          )}

          <View style={styles.orderTypeSelector}>
            <TouchableOpacity
              style={[
                styles.orderTypeButton,
                orderSide === 'buy' && styles.buyButton
              ]}
              onPress={() => setOrderSide('buy')}
            >
              <Text style={styles.orderTypeText}>BUY</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.orderTypeButton,
                orderSide === 'sell' && styles.sellButton
              ]}
              onPress={() => setOrderSide('sell')}
            >
              <Text style={styles.orderTypeText}>SELL</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.orderTypeChips}>
            {['market', 'limit', 'stop_loss', 'take_profit', 'stop_limit'].map((type) => (
              <Chip
                key={type}
                mode={orderType === type ? 'flat' : 'outlined'}
                selected={orderType === type}
                onPress={() => setOrderType(type as any)}
                style={styles.orderTypeChip}
              >
                {type.toUpperCase()}
              </Chip>
            ))}
          </View>

          <TextInput
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
          />

          {orderType !== 'market' && (
            <TextInput
              label="Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />
          )}

          {(orderType === 'stop_loss' || orderType === 'stop_limit') && (
            <TextInput
              label="Stop Price"
              value={stopPrice}
              onChangeText={setStopPrice}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />
          )}

          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setShowOrderModal(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handlePlaceOrder}
              loading={isLoading}
              style={[styles.modalButton, styles.confirmButton]}
            >
              Place Order
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.background, colors.surface]}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }
        >
          {/* Trading Pairs Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trading Pairs</Text>
            <FlatList
              data={tradingPairs}
              renderItem={renderTradingPairCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pairsList}
            />
          </View>

          {/* Chart Section */}
          {selectedPair && (
            <View style={styles.section}>
              <View style={styles.chartHeader}>
                <Text style={styles.sectionTitle}>Chart</Text>
                <View style={styles.timeframeSelector}>
                  {['1m', '5m', '15m', '1h', '4h', '1d'].map((tf) => (
                    <Chip
                      key={tf}
                      mode={chartTimeframe === tf ? 'flat' : 'outlined'}
                      selected={chartTimeframe === tf}
                      onPress={() => setChartTimeframe(tf)}
                      style={styles.timeframeChip}
                      compact
                    >
                      {tf}
                    </Chip>
                  ))}
                </View>
              </View>
              <TradingChart 
                symbol={selectedPair.symbol} 
                timeframe={chartTimeframe}
                style={styles.chart}
              />
            </View>
          )}

          {/* Order Book Section */}
          {selectedPair && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Order Book</Text>
              <OrderBook 
                symbol={selectedPair.symbol} 
                orderBook={orderBook}
                style={styles.orderBook}
              />
            </View>
          )}

          {/* Order History Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order History</Text>
            <FlatList
              data={orderHistory}
              renderItem={renderOrderCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.ordersList}
            />
          </View>
        </ScrollView>

        {/* Floating Action Button */}
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setShowOrderModal(true)}
          disabled={!selectedPair}
        />

        {/* Order Modal */}
        <OrderModal />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  pairsList: {
    paddingHorizontal: 8,
  },
  pairCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    minWidth: 140,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedPairCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '20',
  },
  pairInfo: {
    alignItems: 'center',
  },
  pairSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  pairName: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  pairPriceInfo: {
    alignItems: 'center',
    marginTop: 8,
  },
  pairPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  pairChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeframeSelector: {
    flexDirection: 'row',
    gap: 4,
  },
  timeframeChip: {
    height: 28,
  },
  chart: {
    height: 300,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  orderBook: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
  },
  ordersList: {
    gap: 8,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  orderSideChip: {
    height: 24,
  },
  orderDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  orderType: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  orderAmount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  orderPrice: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  orderStatusChip: {
    height: 24,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    width: width * 0.9,
    maxHeight: height * 0.8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  selectedPairInfo: {
    backgroundColor: colors.primary + '20',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  selectedPairText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  orderTypeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  orderTypeButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  buyButton: {
    backgroundColor: colors.success + '20',
    borderColor: colors.success,
  },
  sellButton: {
    backgroundColor: colors.error + '20',
    borderColor: colors.error,
  },
  orderTypeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  orderTypeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  orderTypeChip: {
    height: 32,
  },
  input: {
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
});

export default TradingScreen;