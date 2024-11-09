import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis, VictoryPie, VictoryLegend } from 'victory-native';
import axios from 'axios';

const Dashboard = () => {
  const [landingCosts, setLandingCosts] = useState([]);
  const [recentImports, setRecentImports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalLandingCosts, setTotalLandingCosts] = useState(0);
  const [averageLandingCost, setAverageLandingCost] = useState(0);
  const [numberOfImports, setNumberOfImports] = useState(0);
  const [landingCostChange, setLandingCostChange] = useState(0);
  const [numberOfImportsChange, setNumberOfImportsChange] = useState(0);
  const [averageLandingCostChange, setAverageLandingCostChange] = useState(0);

  // Fetch data functions
  const fetchLandingCosts = async () => {
    try {
      const landingCostsResponse = await axios.get('http://192.168.46.155:5000/api/imports/landing-cost-trend');

      const currentYear = new Date().getFullYear();

      const groupedData = landingCostsResponse.data.reduce((acc, item) => {
        const date = new Date(Date.parse(item.date));
        const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });

        if (!acc[monthYear]) {
          acc[monthYear] = { x: date, y: 0, year: date.getFullYear() };
        }
        acc[monthYear].y += parseFloat(item.total_cost);
        return acc;
      }, {});

      const formattedLandingCosts = Object.values(groupedData).sort((a, b) => a.x - b.x);

      setLandingCosts(formattedLandingCosts);

      const total = formattedLandingCosts.reduce((acc, cur) => acc + cur.y, 0);
      const average = total / formattedLandingCosts.length;

      const currentYearData = formattedLandingCosts.filter(item => item.year === currentYear);
      const previousYearData = formattedLandingCosts.filter(item => item.year !== currentYear);

      const currentYearTotal = currentYearData.reduce((acc, cur) => acc + cur.y, 0);
      const previousYearTotal = previousYearData.reduce((acc, cur) => acc + cur.y, 0);

      const currentYearAverage = currentYearData.length > 0 ? currentYearTotal / currentYearData.length : 0;
      const previousYearAverage = previousYearData.length > 0 ? previousYearTotal / previousYearData.length : 0;

      const percentageChange = ((currentYearTotal - previousYearTotal) / previousYearTotal) * 100;

      const percentageAverageChange = previousYearAverage > 0
      ? ((currentYearAverage - previousYearAverage) / previousYearAverage) * 100
      : 0;

      setTotalLandingCosts(total);
      setAverageLandingCost(average);
      setLandingCostChange(percentageChange.toFixed(2));
      setAverageLandingCostChange(percentageAverageChange.toFixed(2));
    } catch (error) {
      // console.error('Error fetching landing costs', error);
    }
  };

  const fetchNumberOfImports = async () => {
    try {
      const importsResponse = await axios.get('http://192.168.46.155:5000/api/imports/');
      const currentYear = new Date().getFullYear();
      const previousYear = currentYear - 1;

      // Filter imports by current year and previous year
      const currentYearImports = importsResponse.data.filter(item => {
        const importYear = new Date(item.import_date).getFullYear();
        return importYear === currentYear;
      });

      const previousYearImports = importsResponse.data.filter(item => {
        const importYear = new Date(item.import_date).getFullYear();
        return importYear === previousYear;
      });

      const currentYearCount = currentYearImports.length;
      const previousYearCount = previousYearImports.length;

      // Calculate the change in number of imports
      const change = currentYearCount - previousYearCount;

      setNumberOfImports(importsResponse.data.length);
      setNumberOfImportsChange(change);
    } catch (error) {
      console.error('Error fetching imports data', error);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchLandingCosts(), fetchNumberOfImports()]);
    setLoading(false);
  };

  const fetchRecentImports = async () => {
    try {
      const importsResponse = await axios.get('http://192.168.46.155:5000/api/imports');
      const sortedImports = importsResponse.data
        .sort((a, b) => new Date(b.import_date) - new Date(a.import_date))
        .slice(0, 5);
      setRecentImports(sortedImports);
    } catch (error) {
      console.error('Error fetching recent imports', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchLandingCosts(), fetchRecentImports()]);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
    fetchAllData();
  }, []);

  // Calculate overall cost breakdown for pie chart
  const costBreakdown = recentImports.reduce((acc, importItem) => {
    acc.purchasePrice += parseFloat(importItem.purchase_price) || 0;
    acc.shippingCost += parseFloat(importItem.shipping_cost) || 0;
    acc.importDuties += parseFloat(importItem.import_duties) || 0;
    return acc;
  }, { purchasePrice: 0, shippingCost: 0, importDuties: 0 });

  const totalCost = costBreakdown.purchasePrice + costBreakdown.shippingCost + costBreakdown.importDuties;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading data...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.title}>Landing Costs Module</Text>

      {/* Styled Summary Section */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, styles.totalCostCard]}>
          <Text style={styles.summaryLabel}>Total Landing Costs</Text>
          <Text style={styles.summaryValue}>${totalLandingCosts.toLocaleString()}</Text>
          <Text style={[
            styles.summaryChange,
            landingCostChange >= 0 ? { color: 'green' } : { color: 'red' }
          ]}>
            {landingCostChange >= 0 ? `+${landingCostChange}%` : `${landingCostChange}%`}
          </Text>
        </View>

        <View style={[styles.summaryCard, styles.numberOfImportsCard]}>
          <Text style={styles.summaryLabel}>Number of Imports</Text>
          <Text style={styles.summaryValue}>{numberOfImports.toLocaleString()}</Text>
          <Text style={[
            styles.summaryChange,
            numberOfImportsChange >= 0 ? { color: 'green' } : { color: 'red' }
          ]}>
            {numberOfImportsChange >= 0 ? `+${numberOfImportsChange}` : `${numberOfImportsChange}`}
          </Text>
        </View>

        <View style={[styles.summaryCard, styles.averageCostCard]}>
          <Text style={styles.summaryLabel}>Average Landing Cost</Text>
          <Text style={styles.summaryValue}>${averageLandingCost.toLocaleString()}</Text>
          <Text style={[
            styles.summaryChange,
            averageLandingCostChange >= 0 ? { color: 'green' } : { color: 'red' }
          ]}>
            {averageLandingCostChange >= 0 ? `+ $${averageLandingCostChange}` : `- $${Math.abs(averageLandingCostChange)}`}
          </Text>
        </View>
      </View>

      {/* Title for Landing Costs Trend */}
      <Text style={styles.chartTitle}>Landing Costs Trend</Text>

      {/* Line Chart for Landing Cost Trends */}
      {landingCosts.length > 0 ? (
        <VictoryChart theme={VictoryTheme.material}>
          {/* Y Axis - Landing Cost ($) */}
          <VictoryAxis
            dependentAxis
            tickFormat={(y) => `$${y.toFixed(0)}`}
            label="Landing Cost ($)"
            style={{
              axisLabel: { fontSize: 12, padding: 40 },
              axis: { stroke: "#756f6a" },
              tickLabels: { fontSize: 10, padding: 2, fill: "#000" },
              grid: { stroke: "grey", strokeDasharray: "4, 4" },
            }}
          />

          {/* X Axis - Month Year */}
          <VictoryAxis
            dependentAxis={false}
            tickFormat={(t) => {
              const date = new Date(t);
              return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
            }}
            label="Month Year"
            style={{
              axisLabel: { fontSize: 12, padding: 35 },
              axis: { stroke: "#756f6a" },
              tickLabels: { fontSize: 10, padding: 8, angle: -30, fill: "#000" },
              ticks: { stroke: "grey", size: 5 },
            }}
          />

          <VictoryLine
            data={landingCosts}
            interpolation="natural"
            style={{
              data: { stroke: "#ff7f0e", strokeWidth: 2 },
              parent: { border: "1px solid #ccc" },
            }}
          />
        </VictoryChart>

      ) : (
        <Text>No landing cost data available</Text>
      )}

      {/* Recent Imports Table */}
      <View style={styles.tableContainer}>
        <Text style={styles.tableTitle}>Recent Imports</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>Product</Text>
          <Text style={styles.tableHeaderCell}>Supplier</Text>
          <Text style={styles.tableHeaderCell}>Cost</Text>
        </View>
        {recentImports.length > 0 ? (
          recentImports.map((importItem, index) => (
            <View key={importItem.id} style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}>
              <Text style={styles.tableCell}>{importItem.product_name}</Text>
              <Text style={styles.tableCell}>{importItem.supplier_name}</Text>
              <Text style={styles.tableCell}>
                {importItem.total_landing_cost
                  ? `$${parseFloat(importItem.total_landing_cost).toFixed(2)}`
                  : 'N/A'}
              </Text>
            </View>
          ))
        ) : (
          <Text>No recent imports available</Text>
        )}
      </View>

      {/* Cost Breakdown Pie Chart */}
      <View style={styles.pieContainer}>
        <Text style={styles.tableTitle}>Cost Breakdown</Text>
        <Text>Overall Cost Breakdown</Text>

        <VictoryPie
          data={[
            { x: 'Purchase Price', y: costBreakdown.purchasePrice },
            { x: 'Shipping Cost', y: costBreakdown.shippingCost },
            { x: 'Import Duties', y: costBreakdown.importDuties },
          ]}
          colorScale={["#1f77b4", "#ff7f0e", "#2ca02c"]}
          labels={({ datum }) => `${((datum.y / totalCost) * 100).toFixed(2)}%`}
          style={{
            labels: { fill: "black", fontSize: 12, fontWeight: "bold" },
            data: { stroke: "black", strokeWidth: 1 },
          }}
        />

        <VictoryLegend
          x={125}
          y={10}
          orientation="vertical"
          gutter={20}
          data={[
            { name: "Purchase Price", symbol: { fill: "#1f77b4" } },
            { name: "Shipping Cost", symbol: { fill: "#ff7f0e" } },
            { name: "Import Duties", symbol: { fill: "#2ca02c" } }
          ]}
          style={{
            labels: { fontSize: 14 },
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  summaryCard: {
    alignItems: 'center',
    width: '30%',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  totalCostCard: {
    borderLeftColor: '#1f77b4',
    borderLeftWidth: 4,
  },
  numberOfImportsCard: {
    borderLeftColor: '#2ca02c',
    borderLeftWidth: 4,
  },
  averageCostCard: {
    borderLeftColor: '#ff7f0e',
    borderLeftWidth: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  summaryChange: {
    fontSize: 12,
    marginTop: 5,
    color: '#28a745',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pieContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  tableContainer: {
    marginTop: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 10,
  },
  tableTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#343a40',
    paddingVertical: 8,
    borderRadius: 5,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  tableRowEven: {
    backgroundColor: '#f1f3f5',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#212529',
    textAlign: 'center',
  },
});

export default Dashboard;
