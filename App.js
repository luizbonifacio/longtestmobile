import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import axios from 'axios';

const API_URL = 'https://pk9blqxffi.execute-api.us-east-1.amazonaws.com/xdeal/Xchange';
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjYiLCJuYmYiOjE3NDU2MjYzNTksImV4cCI6MTc0ODIxODM1OSwiaXNzIjoiWHVyMzRQMSIsImF1ZCI6Ilh1cjQ0UFAifQ.qzc-LBSyxuBd7RqMtQFovUo093KtW3p7xHaYUPe0WJ8";

const App = () => {
  const [data, setData] = useState([]);
  const [lastListingId, setLastListingId] = useState('');
  const [lastRowValue, setLastRowValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

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

      console.log('Full API Response:', response.data);
      const newItems = response.data.xchange || []; // Use 'xchange' instead of 'list'
      console.log('New Items:', newItems);

      setHasMore(newItems.length > 0);
      setData(prev => [...prev, ...newItems]);

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

  useEffect(() => {
    console.log('Data state updated:', data);
  }, [data]);

  const renderFooter = () => {
    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (!hasMore) return <Text style={styles.noMore}>No more items</Text>;

    return (
      <TouchableOpacity onPress={fetchData} style={styles.loadMore}>
        <Text style={styles.loadMoreText}>Load More</Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => {
    console.log('Rendering item:', item); // Debugging line
    return (
      <View style={styles.item}>
        <Image
          source={{ uri: item.item_image }}
          style={styles.image}
          resizeMode="cover"
        />
        <View>
          <Text style={styles.title}>{item.brand || 'No Brand'}</Text>
          <Text>Model: {item.model || 'No Model'}</Text>
          <Text>Category: {item.category || 'No Category'}</Text>
          <Text>Price: {item.currency} {item.selling_price || 'N/A'}</Text>
          <Text>Seller: {item.lister_name || 'Unknown'}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {data.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>No items available</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => item.listing_id?.toString() || `key-${index}`}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 5,
  },
  title: {
    fontWeight: 'bold',
  },
  loadMore: {
    padding: 15,
    backgroundColor: '#eee',
    alignItems: 'center',
  },
  loadMoreText: {
    fontWeight: 'bold',
  },
  noMore: {
    padding: 15,
    textAlign: 'center',
    color: 'gray',
  },
});

export default App;
