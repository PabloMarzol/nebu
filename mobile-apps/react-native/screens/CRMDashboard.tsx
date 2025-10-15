import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Alert,
} from 'react-native';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CRMService } from '../services/CRMService';
import { NotificationService } from '../services/NotificationService';

const { width } = Dimensions.get('window');

interface DashboardData {
  customers: {
    total: number;
    new: number;
    active: number;
  };
  deals: {
    total: number;
    value: number;
    won: number;
  };
  support: {
    tickets: number;
    resolved: number;
    avgResponse: number;
  };
  revenue: {
    current: number;
    growth: number;
  };
}

export function CRMDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  useEffect(() => {
    loadDashboardData();
    
    // Set up periodic refresh
    const interval = setInterval(loadDashboardData, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await CRMService.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const chartConfig = {
    backgroundGradientFrom: '#1F2937',
    backgroundGradientTo: '#111827',
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [2000000, 2200000, 2100000, 2400000, 2300000, 2500000],
        color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const dealStageData = [
    {
      name: 'Lead',
      population: 25,
      color: '#6B7280',
      legendFontColor: '#FFFFFF',
      legendFontSize: 12,
    },
    {
      name: 'Qualified',
      population: 20,
      color: '#3B82F6',
      legendFontColor: '#FFFFFF',
      legendFontSize: 12,
    },
    {
      name: 'Proposal',
      population: 15,
      color: '#EAB308',
      legendFontColor: '#FFFFFF',
      legendFontSize: 12,
    },
    {
      name: 'Negotiation',
      population: 10,
      color: '#F97316',
      legendFontColor: '#FFFFFF',
      legendFontSize: 12,
    },
    {
      name: 'Closed Won',
      population: 30,
      color: '#22C55E',
      legendFontColor: '#FFFFFF',
      legendFontSize: 12,
    },
  ];

  if (!dashboardData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor="#3B82F6"
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>CRM Dashboard</Text>
        <Text style={styles.subtitle}>Business Overview</Text>
      </View>

      {/* KPI Cards */}
      <View style={styles.kpiContainer}>
        <View style={styles.kpiRow}>
          <TouchableOpacity style={[styles.kpiCard, styles.kpiCardPrimary]}>
            <Icon name="people" size={24} color="#3B82F6" />
            <Text style={styles.kpiValue}>
              {formatNumber(dashboardData.customers.total)}
            </Text>
            <Text style={styles.kpiLabel}>Total Customers</Text>
            <Text style={styles.kpiChange}>
              +{formatNumber(dashboardData.customers.new)} new
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.kpiCard, styles.kpiCardSuccess]}>
            <Icon name="attach-money" size={24} color="#22C55E" />
            <Text style={styles.kpiValue}>
              {formatCurrency(dashboardData.revenue.current)}
            </Text>
            <Text style={styles.kpiLabel}>Revenue</Text>
            <Text style={styles.kpiChange}>
              +{dashboardData.revenue.growth}% growth
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.kpiRow}>
          <TouchableOpacity style={[styles.kpiCard, styles.kpiCardWarning]}>
            <Icon name="trending-up" size={24} color="#F59E0B" />
            <Text style={styles.kpiValue}>
              {formatNumber(dashboardData.deals.total)}
            </Text>
            <Text style={styles.kpiLabel}>Active Deals</Text>
            <Text style={styles.kpiChange}>
              {formatCurrency(dashboardData.deals.value)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.kpiCard, styles.kpiCardInfo]}>
            <Icon name="support-agent" size={24} color="#8B5CF6" />
            <Text style={styles.kpiValue}>
              {formatNumber(dashboardData.support.tickets)}
            </Text>
            <Text style={styles.kpiLabel}>Support Tickets</Text>
            <Text style={styles.kpiChange}>
              {dashboardData.support.avgResponse}h avg
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Chart Section */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Revenue Trend</Text>
        <LineChart
          data={revenueData}
          width={width - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Deal Pipeline */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Deal Pipeline</Text>
        <PieChart
          data={dealStageData}
          width={width - 32}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[10, 10]}
          absolute
          style={styles.chart}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.quickAction}>
            <Icon name="person-add" size={28} color="#3B82F6" />
            <Text style={styles.quickActionText}>Add Customer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Icon name="add-circle" size={28} color="#22C55E" />
            <Text style={styles.quickActionText}>New Deal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Icon name="support" size={28} color="#F59E0B" />
            <Text style={styles.quickActionText}>Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Icon name="analytics" size={28} color="#8B5CF6" />
            <Text style={styles.quickActionText}>Reports</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.activityContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <Icon name="person-add" size={20} color="#22C55E" />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New customer registered</Text>
              <Text style={styles.activityTime}>2 minutes ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <Icon name="trending-up" size={20} color="#3B82F6" />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Deal moved to negotiation</Text>
              <Text style={styles.activityTime}>15 minutes ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <Icon name="support-agent" size={20} color="#F59E0B" />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Support ticket resolved</Text>
              <Text style={styles.activityTime}>1 hour ago</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  header: {
    padding: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  kpiContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    borderWidth: 1,
  },
  kpiCardPrimary: {
    borderColor: '#3B82F6',
  },
  kpiCardSuccess: {
    borderColor: '#22C55E',
  },
  kpiCardWarning: {
    borderColor: '#F59E0B',
  },
  kpiCardInfo: {
    borderColor: '#8B5CF6',
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  kpiLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  kpiChange: {
    fontSize: 12,
    color: '#22C55E',
    marginTop: 4,
  },
  chartContainer: {
    backgroundColor: '#1F2937',
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 8,
  },
  quickActionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '48%',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 8,
    textAlign: 'center',
  },
  activityContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  activityList: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityContent: {
    marginLeft: 12,
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
});