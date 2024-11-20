import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';  // Import useNavigation
import axios from 'axios';

const ImportsManagement = () => {
  const navigation = useNavigation();  // Initialize navigation

  // State variables to store form input
  const [productName, setProductName] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [shippingCost, setShippingCost] = useState('');
  const [importDuties, setImportDuties] = useState('');
  const [category, setCategory] = useState('');

  // Function to handle form submission
  const handleAddImport = async () => {
    if (!productName || !supplierName || !purchasePrice || !shippingCost || !importDuties || !category) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    const newImport = {
      product_name: productName,
      supplier_name: supplierName,
      purchase_price: parseFloat(purchasePrice),
      shipping_cost: parseFloat(shippingCost),
      import_duties: parseFloat(importDuties),
      category: category,
    };

    try {
      // Make a POST request to the backend to add the new import
      await axios.post('http://172.20.10.2:5050/api/imports/add', newImport);
      Alert.alert('Success', 'Import added successfully!');

      // Clear form inputs after submission
      setProductName('');
      setSupplierName('');
      setPurchasePrice('');
      setShippingCost('');
      setImportDuties('');
      setCategory('');

      // Redirect to Dashboard after successful import
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Error adding import', error);
      Alert.alert('Error', 'Failed to add import');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Import</Text>

      {/* Product Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={productName}
        onChangeText={setProductName}
      />

      {/* Supplier Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Supplier Name"
        value={supplierName}
        onChangeText={setSupplierName}
      />

      {/* Purchase Price Input */}
      <TextInput
        style={styles.input}
        placeholder="Purchase Price"
        keyboardType="numeric"
        value={purchasePrice}
        onChangeText={setPurchasePrice}
      />

      {/* Shipping Cost Input */}
      <TextInput
        style={styles.input}
        placeholder="Shipping Cost"
        keyboardType="numeric"
        value={shippingCost}
        onChangeText={setShippingCost}
      />

      {/* Import Duties Input */}
      <TextInput
        style={styles.input}
        placeholder="Import Duties"
        keyboardType="numeric"
        value={importDuties}
        onChangeText={setImportDuties}
      />

      {/* Category Input */}
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />

      {/* Submit Button */}
      <Button title="Add Import" onPress={handleAddImport} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
});

export default ImportsManagement;
