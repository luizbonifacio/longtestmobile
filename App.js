import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import styles from './AppStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const API_URL = 'https://pk9blqxffi.execute-api.us-east-1.amazonaws.com/xdeal/Xchange';
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjYiLCJuYmYiOjE3NDU2MjYzNTksImV4cCI6MTc0ODIxODM1OSwiaXNzIjoiWHVyMzRQMSIsImF1ZCI6Ilh1cjQ0UFAifQ.qzc-LBSyxuBd7RqMtQFovUo093KtW3p7xHaYUPe0WJ8";

const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [lastListingId, setLastListingId] = useState('');
  const [lastRowValue, setLastRowValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      console.log('Fetching data...');
      const response = await axios.post(API_URL, {
        categories: [],
        last_listing_id: lastListingId,
        last_row_value: lastRowValue,
        max: '',
        min: '',
        search: '',
        sort: '',
        token: TOKEN,
        user_type: 'Xpert',
        version_number: '2.2.6',
      });

      const newItems = response.data.xchange || [];
      setHasMore(newItems.length > 0);
      setData(prev => [...prev, ...newItems]);
      setFilteredData(prev => [...prev, ...newItems]); // Initialize filteredData with all data

      if (newItems.length > 0) {
        const lastItem = newItems[newItems.length - 1];
        setLastListingId(lastItem.listing_id || '');
        setLastRowValue(lastItem.row_value || '');
      }
    } catch (error) {
      console.error('API fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter data based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item => 
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, data]);

  const renderFooter = () => {
    if (loading) return <ActivityIndicator size="large" color="#0a7" />;
    if (!hasMore) return <Text style={styles.noMore}>No more items</Text>;
    if (searchQuery.trim() !== '') return null; // Don't show load more when searching

    return (
      <TouchableOpacity onPress={fetchData} style={styles.loadMore}>
        <Text style={styles.loadMoreText}>Load More</Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.item_image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.brand}</Text>
        <Text style={styles.cardSubtitle}>{item.model}</Text>
        <Text style={styles.cardCategory}>{item.category}</Text>
        <Text style={styles.cardPrice}>{item.currency} {item.selling_price}</Text>
        <View style={styles.listerContainer}>
          <Image source={{ uri: item.lister_image }} style={styles.listerImage} />
          <Text style={styles.listerName}>{item.lister_name}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Grab Store</Text>
        <Icon name="cart-outline" size={24} color="#fff" />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          placeholder="Search items..."
          placeholderTextColor="#999"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
      </View>

      {/* Item Grid */}
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.listing_id}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListFooterComponent={renderFooter}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem}>
          <Icon name="home-outline" size={24} color="#0a7" />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <Icon name="heart-outline" size={24} color="#888" />
          <Text style={styles.footerText}>Wishlist</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <Icon name="person-outline" size={24} color="#888" />
          <Text style={styles.footerText}>Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default App;