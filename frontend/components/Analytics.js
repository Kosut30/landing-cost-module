import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryScatter, VictoryBar, VictoryLegend, VictoryTheme } from 'victory-native';
import axios from 'axios';

const Analytics = () => {
    const [landingCosts, setLandingCosts] = useState([]);
    const [supplierComparison, setSupplierComparison] = useState([]);
    const [productCategoryAnalysis, setProductCategoryAnalysis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Function to fetch the data
    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            // Fetch Landing Costs Over Time
            const landingCostsResponse = await axios.get('http://192.168.46.155:5000/api/imports/landing-cost-trend');
            const formattedLandingCosts = landingCostsResponse.data.map(item => ({
                x: new Date(item.date),
                y: parseFloat(item.total_cost)
            }));
            setLandingCosts(formattedLandingCosts);

            // Fetch Supplier Comparison
            const supplierComparisonResponse = await axios.get('http://192.168.46.155:5000/api/supplier-comparison');
            const formattedSupplierComparison = supplierComparisonResponse.data.map(item => ({
                x: parseFloat(item.total_cost),
                y: parseInt(item.number_of_imports),
                size: parseInt(item.number_of_imports) * 10, // Customize size based on number of imports
                supplier: item.supplier_name,
            }));
            setSupplierComparison(formattedSupplierComparison);

            // Fetch Product Category Analysis
            const productCategoryResponse = await axios.get('http://192.168.46.155:5000/api/product-category-analysis');
            setProductCategoryAnalysis(productCategoryResponse.data);
        } catch (error) {
            console.error('Error fetching analytics data', error);
        } finally {
            setLoading(false);
        }
    };

    // Refresh function for pull-to-refresh
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchAnalyticsData();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading analytics data...</Text>
            </View>
        );
    }

    // Track the last displayed month and year
    let lastDisplayedMonth = null;

    // Dynamically generate colors for suppliers
    const generateSupplierColor = (supplier) => {
        // Use a simple hash-based approach to generate colors for suppliers
        const hash = Array.from(supplier).reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const color = `hsl(${hash % 360}, 70%, 50%)`; // Generate a unique HSL color
        return color;
    };

    // Create a unique color for each supplier
    const supplierColors = supplierComparison.reduce((acc, item) => {
        if (!acc[item.supplier]) {
            acc[item.supplier] = generateSupplierColor(item.supplier);
        }
        return acc;
    }, {});

    // Generate legend items dynamically based on unique suppliers
    const supplierLegend = Object.keys(supplierColors).map(supplier => ({
        name: supplier,
        symbol: { fill: supplierColors[supplier] },
    }));

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <Text style={styles.title}>Analytics</Text>

            {/* Landing Costs Over Time */}
            <Text style={styles.chartTitle}>Landing Costs Over Time</Text>
            <VictoryChart theme={VictoryTheme.material}>
                <VictoryAxis
                    dependentAxis
                    tickFormat={(y) => `$${y}`}
                    label="Cost ($)"
                    style={{
                        axisLabel: { padding: 40, fontSize: 12 },
                        tickLabels: { fontSize: 10, padding: 5 },
                        grid: { stroke: "#e0e0e0", strokeDasharray: "5,5" },
                    }}
                />
                <VictoryAxis
                    tickFormat={(t) => {
                        const date = new Date(t);
                        const currentMonth = date.getMonth();
                        const currentYear = date.getFullYear();
                        if (lastDisplayedMonth !== `${currentMonth}-${currentYear}`) {
                            lastDisplayedMonth = `${currentMonth}-${currentYear}`;
                            return date.toLocaleString('default', { month: 'short', year: 'numeric' });
                        }
                        return '';
                    }}
                    label="Date"
                    style={{
                        axisLabel: { padding: 30, fontSize: 12 },
                        tickLabels: { fontSize: 10, padding: 5 },
                    }}
                />
                <VictoryLine
                    data={landingCosts}
                    style={{ data: { stroke: "#1f77b4", strokeWidth: 2 } }}
                />
            </VictoryChart>

            {/* Supplier Comparison */}
            <Text style={styles.chartTitle}>Supplier Comparison</Text>
            <VictoryChart theme={VictoryTheme.material}>
                <VictoryAxis
                    label="Total Cost"
                    style={{
                        axisLabel: { padding: 40, fontSize: 12 },
                        tickLabels: { fontSize: 10 },
                    }}
                />
                <VictoryAxis
                    dependentAxis
                    label="Number of Imports"
                    style={{
                        axisLabel: { padding: 40, fontSize: 12 },
                        tickLabels: { fontSize: 10 },
                        grid: { stroke: "#e0e0e0", strokeDasharray: "5,5" },
                    }}
                />
                <VictoryScatter
                    data={supplierComparison}
                    size={({ datum }) => datum.size}
                    style={{
                        data: { fill: ({ datum }) => supplierColors[datum.supplier] || '#7f7f7f' }, // Default gray if no color is found
                    }}
                />
                <VictoryLegend
                    x={60}
                    y={10}
                    orientation="horizontal"
                    gutter={20}
                    data={supplierLegend} // Dynamically generated legend items
                />
            </VictoryChart>

            {/* Product Category Analysis */}
            <Text style={styles.chartTitle}>Product Category Analysis</Text>
            <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
                <VictoryAxis
                    label="Category"
                    style={{
                        axisLabel: { padding: 40, fontSize: 12 },
                        tickLabels: { fontSize: 10, angle: -30 },
                    }}
                />
                <VictoryAxis
                    dependentAxis
                    label="Value ('000)"
                    tickFormat={(y) => `${(y / 1000).toFixed(1)}K`}
                    style={{
                        axisLabel: { padding: 40, fontSize: 12 },
                        tickLabels: { fontSize: 10 },
                        grid: { stroke: "#e0e0e0", strokeDasharray: "5,5" },
                    }}
                />
                <VictoryBar
                    data={productCategoryAnalysis}
                    x="category"
                    y="average_cost"
                    style={{ data: { fill: "#1f77b4" } }}
                />
                <VictoryBar
                    data={productCategoryAnalysis}
                    x="category"
                    y="total_imports"
                    style={{ data: { fill: "#ff7f0e" } }}
                />
            </VictoryChart>
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
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default Analytics;
