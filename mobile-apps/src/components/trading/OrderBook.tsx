import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { Card, Chip } from 'react-native-paper';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';

import { RootState } from '../../store/store';
import { colors } from '../../theme/colors';

const { width } = Dimensions.get('window');

interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
}

interface OrderBookData {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  spread: number;
  timestamp: number;
}

interface OrderBookProps {
  symbol: string;
  orderBook: OrderBookData;
  style?: any;
}

export const OrderBook: React.FC<OrderBookProps> = ({ 
  symbol, 
  orderBook, 
  style 
}) => {
  const [maxQuantity, setMaxQuantity] = useState(0);
  const [priceDecimals, setPriceDecimals] = useState(2);
  const [quantityDecimals, setQuantityDecimals] = useState(4);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [displayMode, setDisplayMode] = useState<'combined' | 'separate'>('combined');

  useEffect(() => {
    if (orderBook?.bids && orderBook?.asks) {
      // Calculate max quantity for visualization
      const allEntries = [...orderBook.bids, ...orderBook.asks];
      const maxQty = Math.max(...allEntries.map(entry => entry.quantity));
      setMaxQuantity(maxQty);

      // Determine decimal places based on price range
      const allPrices = allEntries.map(entry => entry.price);
      const minPrice = Math.min(...allPrices);
      const maxPrice = Math.max(...allPrices);
      
      if (maxPrice < 1) {
        setPriceDecimals(6);
      } else if (maxPrice < 100) {
        setPriceDecimals(4);
      } else {
        setPriceDecimals(2);
      }
    }
  }, [orderBook]);

  const formatPrice = (price: number) => {
    return price.toFixed(priceDecimals);
  };

  const formatQuantity = (quantity: number) => {
    return quantity.toFixed(quantityDecimals);
  };

  const formatTotal = (total: number) => {
    return total.toFixed(2);
  };

  const getQuantityBarWidth = (quantity: number) => {
    if (maxQuantity === 0) return 0;
    return (quantity / maxQuantity) * 100;
  };

  const handlePriceSelect = (price: number) => {
    setSelectedPrice(price === selectedPrice ? null : price);
  };

  const renderOrderBookEntry = (
    entry: OrderBookEntry, 
    index: number, 
    type: 'bid' | 'ask'
  ) => {
    const isSelected = selectedPrice === entry.price;
    const barWidth = getQuantityBarWidth(entry.quantity);
    const barColor = type === 'bid' ? colors.success : colors.error;
    const textColor = type === 'bid' ? colors.success : colors.error;

    return (
      <TouchableOpacity
        key={`${type}-${index}`}
        style={[
          styles.orderBookRow,
          isSelected && styles.selectedRow,
        ]}
        onPress={() => handlePriceSelect(entry.price)}
      >
        <View style={styles.orderBookRowContent}>
          {/* Quantity Bar Background */}
          <View
            style={[
              styles.quantityBar,
              {
                width: `${barWidth}%`,
                backgroundColor: barColor + '20',
              },
            ]}
          />
          
          {/* Price */}
          <Text style={[styles.priceText, { color: textColor }]}>
            {formatPrice(entry.price)}
          </Text>
          
          {/* Quantity */}
          <Text style={styles.quantityText}>
            {formatQuantity(entry.quantity)}
          </Text>
          
          {/* Total */}
          <Text style={styles.totalText}>
            {formatTotal(entry.total)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSeparateOrderBooks = () => (
    <View style={styles.separateContainer}>
      {/* Asks (Sell Orders) */}
      <View style={styles.orderBookSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.error }]}>
            Asks (Sell)
          </Text>
          <Chip
            mode="outlined"
            compact
            style={[styles.countChip, { borderColor: colors.error }]}
          >
            {orderBook?.asks?.length || 0}
          </Chip>
        </View>
        
        <View style={styles.orderBookHeader}>
          <Text style={styles.headerText}>Price</Text>
          <Text style={styles.headerText}>Quantity</Text>
          <Text style={styles.headerText}>Total</Text>
        </View>
        
        <FlatList
          data={orderBook?.asks?.slice(0, 10) || []}
          renderItem={({ item, index }) => renderOrderBookEntry(item, index, 'ask')}
          keyExtractor={(item, index) => `ask-${index}`}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Spread */}
      <View style={styles.spreadContainer}>
        <Text style={styles.spreadLabel}>Spread</Text>
        <Text style={styles.spreadValue}>
          {orderBook?.spread ? formatPrice(orderBook.spread) : '0.00'}
        </Text>
        <Text style={styles.spreadPercentage}>
          {orderBook?.spread && orderBook?.bids?.[0]?.price
            ? `${((orderBook.spread / orderBook.bids[0].price) * 100).toFixed(2)}%`
            : '0.00%'
          }
        </Text>
      </View>

      {/* Bids (Buy Orders) */}
      <View style={styles.orderBookSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.success }]}>
            Bids (Buy)
          </Text>
          <Chip
            mode="outlined"
            compact
            style={[styles.countChip, { borderColor: colors.success }]}
          >
            {orderBook?.bids?.length || 0}
          </Chip>
        </View>
        
        <View style={styles.orderBookHeader}>
          <Text style={styles.headerText}>Price</Text>
          <Text style={styles.headerText}>Quantity</Text>
          <Text style={styles.headerText}>Total</Text>
        </View>
        
        <FlatList
          data={orderBook?.bids?.slice(0, 10) || []}
          renderItem={({ item, index }) => renderOrderBookEntry(item, index, 'bid')}
          keyExtractor={(item, index) => `bid-${index}`}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );

  const renderCombinedOrderBook = () => (
    <View style={styles.combinedContainer}>
      {/* Header */}
      <View style={styles.orderBookHeader}>
        <Text style={styles.headerText}>Price</Text>
        <Text style={styles.headerText}>Quantity</Text>
        <Text style={styles.headerText}>Total</Text>
      </View>

      {/* Asks (reversed order) */}
      <FlatList
        data={orderBook?.asks?.slice(0, 10).reverse() || []}
        renderItem={({ item, index }) => renderOrderBookEntry(item, index, 'ask')}
        keyExtractor={(item, index) => `ask-${index}`}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />

      {/* Spread */}
      <View style={styles.spreadContainer}>
        <Text style={styles.spreadValue}>
          {orderBook?.spread ? formatPrice(orderBook.spread) : '0.00'}
        </Text>
        <Text style={styles.spreadPercentage}>
          {orderBook?.spread && orderBook?.bids?.[0]?.price
            ? `${((orderBook.spread / orderBook.bids[0].price) * 100).toFixed(2)}%`
            : '0.00%'
          }
        </Text>
      </View>

      {/* Bids */}
      <FlatList
        data={orderBook?.bids?.slice(0, 10) || []}
        renderItem={({ item, index }) => renderOrderBookEntry(item, index, 'bid')}
        keyExtractor={(item, index) => `bid-${index}`}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  if (!orderBook) {
    return (
      <View style={[styles.container, styles.emptyContainer, style]}>
        <Icon name="chart-line" size={48} color={colors.textSecondary} />
        <Text style={styles.emptyText}>No order book data available</Text>
        <Text style={styles.emptySubtext}>
          Select a trading pair to view live order book
        </Text>
      </View>
    );
  }

  return (
    <Animatable.View animation="fadeIn" style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Order Book</Text>
        <View style={styles.controls}>
          <TouchableOpacity
            style={[
              styles.controlButton,
              displayMode === 'combined' && styles.activeControl,
            ]}
            onPress={() => setDisplayMode('combined')}
          >
            <Icon
              name="view-agenda"
              size={20}
              color={displayMode === 'combined' ? colors.primary : colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.controlButton,
              displayMode === 'separate' && styles.activeControl,
            ]}
            onPress={() => setDisplayMode('separate')}
          >
            <Icon
              name="view-split-vertical"
              size={20}
              color={displayMode === 'separate' ? colors.primary : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Symbol Info */}
      <View style={styles.symbolInfo}>
        <Text style={styles.symbolText}>{symbol}</Text>
        <Text style={styles.timestampText}>
          {orderBook.timestamp ? new Date(orderBook.timestamp).toLocaleTimeString() : 'Live'}
        </Text>
      </View>

      {/* Order Book Display */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {displayMode === 'combined' ? renderCombinedOrderBook() : renderSeparateOrderBooks()}
      </ScrollView>

      {/* Selected Price Info */}
      {selectedPrice && (
        <Animatable.View animation="slideInUp" style={styles.selectedPriceInfo}>
          <Text style={styles.selectedPriceText}>
            Selected Price: {formatPrice(selectedPrice)}
          </Text>
          <TouchableOpacity
            style={styles.clearSelectionButton}
            onPress={() => setSelectedPrice(null)}
          >
            <Icon name="close" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </Animatable.View>
      )}
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  controls: {
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  activeControl: {
    backgroundColor: colors.primary + '20',
  },
  symbolInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  symbolText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  timestampText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  separateContainer: {
    gap: 16,
  },
  combinedContainer: {
    gap: 2,
  },
  orderBookSection: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  countChip: {
    height: 24,
  },
  orderBookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textSecondary,
    flex: 1,
    textAlign: 'center',
  },
  orderBookRow: {
    position: 'relative',
    marginVertical: 1,
  },
  selectedRow: {
    backgroundColor: colors.primary + '20',
    borderRadius: 4,
  },
  orderBookRowContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    minHeight: 32,
  },
  quantityBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 4,
  },
  priceText: {
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    zIndex: 1,
  },
  quantityText: {
    fontSize: 12,
    color: colors.text,
    flex: 1,
    textAlign: 'center',
    zIndex: 1,
  },
  totalText: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
    textAlign: 'center',
    zIndex: 1,
  },
  spreadContainer: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  spreadLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  spreadValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  spreadPercentage: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  selectedPriceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary + '20',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  selectedPriceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  clearSelectionButton: {
    padding: 4,
  },
});

export default OrderBook;