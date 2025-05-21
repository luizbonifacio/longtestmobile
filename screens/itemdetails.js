// src/screens/ItemDetails.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ItemDetails = ({ route }) => {
  const { item } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.item_image }} style={styles.image} />
      <Text style={styles.title}>{item.brand} - {item.model}</Text>
      <Text style={styles.price}>{item.currency} {item.selling_price}</Text>
      <Text style={styles.category}>Category: {item.category}</Text>
      <Text style={styles.lister}>Listed by: {item.lister_name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  image: { width: '100%', height: 200, borderRadius: 10 },
  title: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  price: { fontSize: 18, color: 'green' },
  category: { fontSize: 16, color: '#555' },
  lister: { fontSize: 16, color: '#777', marginTop: 10 }
});

export default ItemDetails;
