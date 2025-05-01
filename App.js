import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from 'axios';

const API_URL = 'https://pk9blqxffi.execute-api.us-east-1.amazonaws.com/xdeal/Xchange';
const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjYiLCJuYmYiOjE3NDU2MjYzNTksImV4cCI6MTc0ODIxODM1OSwiaXNzIjoiWHVyMzRQMSIsImF1ZCI6Ilh1cjQ0UFAifQ.qzc-LBSyxuBd7RqMtQFovUo093KtW3p7xHaYUPe0WJ8';

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

      const newItems = response.data.list || [];
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

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title || 'No Title'}</Text>
      <Text>{item.description || 'No Description'}</Text>
    </View>
  );

  const renderFooter = () => {
    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (!hasMore) return <Text style={styles.noMore}>No more items</Text>;

    return (
      <TouchableOpacity onPress={fetchData} style={styles.loadMore}>
        <Text style={styles.loadMoreText}>Load More</Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => item.listing_id?.toString() || index.toString()}
      renderItem={renderItem}
      ListFooterComponent={renderFooter}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
