import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  TextInput,
  Animated,
  Dimensions,
  ScrollView,
  Modal,
} from 'react-native';
import styles from '../AppStyles';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const API_URL = 'https://pk9blqxffi.execute-api.us-east-1.amazonaws.com/xdeal/Xchange';
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJuYmYiOjE3NDYxOTI1MTQsImV4cCI6MTc0ODc4NDUxNCwiaXNzIjoiWHVyMzRQMSIsImF1ZCI6Ilh1cjQ0UFAifQ.QD-fcLXtznCfkTIYkbOQfc5fXfxYgw_mOziKWpUHddk"

const STATIC_CATEGORIES = [
  "Bags",
  "Shoes",
  "Jewelry",
  "Toys",
  "Watches",
  "Automative and Parts",
  "Electronics and Gadgets",
  "Clothing",
  "Eyewear",
  "Musical Instrument",
  "Trading Cards",
  "Artworks",
  "Rare Coins",
  "Books and Comic Books",
  "Stamps",
  "Antiques",
  "Music",
  "Movie",
  "Sports",
  "Others"
];

const STATIC_RANGES = [
  "1k - 5k",
  "5k - 10k",
  "10k - 50k",
  "50k - 100k",
  "100k - 500k",
  "500k - 1M",
];

const Xchange = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [lastListingId, setLastListingId] = useState('');
  const [lastRowValue, setLastRowValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [sortLabel, setSortLabel] = useState('Category');
  const [pendingSortLabel, setPendingSortLabel] = useState('Category'); // Temporary state for modal selection
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRange, setSelectedRange] = useState(null);
  const [sortOrder, setSortOrder] = useState(null); // null means no selection

  // Add state variables for Min and Max values
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');

  const drawerAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;

  const navigation = useNavigation();

  // Function to open the drawer
  const openDrawer = () => {
    setDrawerVisible(true);
    Animated.timing(drawerAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(drawerAnim, {
      toValue: Dimensions.get('window').height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setDrawerVisible(false));
  }

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
      const newItems = response.data.xchange || []; 
      console.log('New Items:', newItems);


      setHasMore(newItems.length > 0);
      setData(prev => [...prev, ...newItems]);
      setFilteredData(prev => [...prev, ...newItems]); 

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
    if (searchQuery.trim() !== '') return null; 

    return (
      <TouchableOpacity onPress={fetchData} style={styles.loadMore}>
        <Text style={styles.loadMoreText}>Load More</Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ItemDetails', { item })}
      style={styles.card}
    >
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
    </TouchableOpacity>
  );
  
  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category) // Remove if already selected
        : [...prev, category] // Add if not selected
    );
  };

  const toggleRange = (range) => {
    setSelectedRange((prev) => (prev === range ? null : range)); // Deselect if already selected
  };

  const toggleSortOrder = (order) => {
    setSortOrder((prev) => (prev === order ? null : order)); // Deselect if already selected
  };

  const applySort = (sortBy) => {
    const sortedData = [...filteredData].sort((a, b) => {
      if (a[sortBy.toLowerCase()] < b[sortBy.toLowerCase()]) return -1;
      if (a[sortBy.toLowerCase()] > b[sortBy.toLowerCase()]) return 1;
      return 0;
    });
    setFilteredData(sortedData);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Grab Store</Text>
        <Icon name="cart-outline" size={24} color="#fff" />
      </View>

   
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          placeholder="Search items..."
          placeholderTextColor="#999"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {
            openDrawer();
            console.log('Filter button pressed');
          }}
        >
          <Icon name="filter-outline" size={22} color="gray" />
        </TouchableOpacity>
      </View>

      {drawerVisible && (
        <>
          {/* Overlay */}
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.3)',
              zIndex: 10,
            }}
            activeOpacity={1}
            onPress={closeDrawer}
          />
          {/* Drawer Panel */}
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 280,
              height: '100%',
              backgroundColor: '#fff',
              zIndex: 20,
              elevation: 5,
              padding: 20,
              transform: [{ translateX: drawerAnim }],
            }}
          >
            <ScrollView
              contentContainerStyle={{ paddingBottom: 20 }} // Adds padding at the bottom
              showsVerticalScrollIndicator={false} // Hides the vertical scroll indicator
            >
              <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Sort</Text>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#eee',
                  borderRadius: 8,
                  height: 40,
                  marginBottom: 10,
                  paddingHorizontal: 12,
                }}
                activeOpacity={0.7}
                onPress={() => setIsModalVisible(true)} // Open the modal
              >
                <Text style={{ flex: 1, textAlign: 'center', color: '#444', fontSize: 16 }}>
                  {sortLabel}
                </Text>
                <Icon name="chevron-down" size={22} color="#444" />
              </TouchableOpacity>

              {/* Other drawer content */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: sortOrder === 'ASC' ? '#B38B5D' : '#eee', // Highlight if selected
                    padding: 10,
                    borderRadius: 25,
                    marginRight: 8,
                    alignItems: 'center',
                  }}
                  onPress={() => toggleSortOrder('ASC')} // Toggle ASC selection
                >
                  <Text style={{ color: sortOrder === 'ASC' ? '#fff' : '#444' }}>ASC</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: sortOrder === 'DESC' ? '#B38B5D' : '#eee', // Highlight if selected
                    padding: 10,
                    borderRadius: 25,
                    marginLeft: 8,
                    alignItems: 'center',
                  }}
                  onPress={() => toggleSortOrder('DESC')} // Toggle DESC selection
                >
                  <Text style={{ color: sortOrder === 'DESC' ? '#fff' : '#444' }}>DESC</Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  height: 1,
                  backgroundColor: '#ddd',
                  marginBottom: 10,
                  marginHorizontal: -8,
                }}
              />

              <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Filter by Category</Text>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginHorizontal: -2,
                }}
              >
                {STATIC_CATEGORIES.map((cat, idx) => (
                  <TouchableOpacity
                    key={cat + idx}
                    style={{
                      backgroundColor: selectedCategories.includes(cat) ? '#B38B5D' : '#eee', // Highlight color is now #B38B5D
                      borderRadius: 20,
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      marginBottom: 5,
                      marginHorizontal: 2,
                      borderWidth: selectedCategories.includes(cat) ? 1 : 0, // Optional: Add a border for better visibility
                      borderColor: selectedCategories.includes(cat) ? '#ccc' : 'transparent',
                    }}
                    onPress={() => toggleCategory(cat)} // Toggle category selection
                  >
                    <Text style={{ color: selectedCategories.includes(cat) ? '#fff' : '#444' }}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View
                style={{
                  height: 1,
                  backgroundColor: '#ddd',
                  marginTop: 10,
                  marginBottom: 10,
                  marginHorizontal: -8,
                }}
              />

              <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Value Range</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <TextInput
                  placeholder="Min"
                  keyboardType="numeric"
                  value={minValue} // Bind the state to the input
                  onChangeText={(text) => setMinValue(text)} // Update state on input change
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 8,
                    padding: 10,
                    marginRight: 8,
                  }}
                />
                <Text style={{ marginHorizontal: 4, color: '#444', fontSize: 16 }}>-</Text>
                <TextInput
                  placeholder="Max"
                  keyboardType="numeric"
                  value={maxValue} // Bind the state to the input
                  onChangeText={(text) => setMaxValue(text)} // Update state on input change
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 8,
                    padding: 10,
                    marginLeft: 8,
                  }}
                />
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 8, flexDirection: 'row' }}
                style={{ marginBottom: 10 }}
              >
                {STATIC_RANGES.map((range, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={{
                      backgroundColor: selectedRange === range ? '#B38B5D' : '#eee', // Highlight if selected
                      borderRadius: 20,
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      marginRight: 8,
                      alignItems: 'center',
                      borderWidth: selectedRange === range ? 1 : 0, // Optional: Add a border for better visibility
                      borderColor: selectedRange === range ? '#ccc' : 'transparent',
                    }}
                    onPress={() => toggleRange(range)} // Toggle range selection
                  >
                    <Text style={{ color: selectedRange === range ? '#fff' : '#444' }}>
                      {range}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </ScrollView>

             <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 0, marginTop: 20 }}>
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 24,
                  borderRadius: 999,
                  marginHorizontal: 5,
                  backgroundColor: '#888888',
                }}
                onPress={() => {
                  setSelectedCategories([]); // Clear selected categories
                  setSelectedRange(null); // Clear selected range
                  setSortOrder(null); // Clear sort order
                  setSortLabel('Category'); // Reset sort label to "Category"
                  setMinValue(''); // Clear Min value
                  setMaxValue(''); // Clear Max value
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 24,
                  borderRadius: 999,
                  marginHorizontal: 5,
                  backgroundColor: '#B38B5D',
                }}
                onPress={() => {
                  let filtered = data;

                  console.log('Original Data:', data); // Debug: Log the original data

                  // Filter by selected categories
                  if (selectedCategories.length > 0) {
                    filtered = filtered.filter(item =>
                      selectedCategories.includes(item.category)
                    );
                    console.log('Filtered by Categories:', filtered); // Debug: Log after category filtering
                  }

                  // Filter by selected sortLabel (Category, Brand, or Model)
                  if (pendingSortLabel === 'Brand' || pendingSortLabel === 'Model' || pendingSortLabel === 'Category') {
                    filtered = filtered.filter(item =>
                      item[pendingSortLabel.toLowerCase()] // Dynamically access the property
                    );
                    console.log(`Filtered by ${pendingSortLabel}:`, filtered); // Debug: Log after sortLabel filtering
                  }

                  // Filter by Min and Max values
                  if (minValue !== '' || maxValue !== '') {
                    filtered = filtered.filter(item => {
                      const price = parseFloat(item.selling_price);
                      const min = minValue !== '' ? parseFloat(minValue) : -Infinity;
                      const max = maxValue !== '' ? parseFloat(maxValue) : Infinity;
                      return price >= min && price <= max;
                    });
                    console.log('Filtered by Min and Max:', filtered); // Debug: Log after Min/Max filtering
                  }

                  // Filter by selected range
                  if (selectedRange) {
                    const [rangeMin, rangeMax] = selectedRange
                      .split(' - ')
                      .map(value => parseFloat(value.replace('k', '')) * 1000); // Convert "1k" to 1000
                    filtered = filtered.filter(item => {
                      const price = parseFloat(item.selling_price);
                      return price >= rangeMin && price <= rangeMax;
                    });
                    console.log('Filtered by Selected Range:', filtered); // Debug: Log after range filtering
                  }

                  // Sort by price if sortOrder is selected
                  if (sortOrder === 'ASC') {
                    filtered = filtered.sort((a, b) => a.selling_price - b.selling_price);
                    console.log('Sorted by Price (ASC):', filtered); // Debug: Log after sorting
                  } else if (sortOrder === 'DESC') {
                    filtered = filtered.sort((a, b) => b.selling_price - a.selling_price);
                    console.log('Sorted by Price (DESC):', filtered); // Debug: Log after sorting
                  }

                  setFilteredData(filtered); // Update the filtered data
                  console.log('Final Filtered Data:', filtered); // Debug: Log the final filtered data

                  closeDrawer(); // Close the filters drawer
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Apply</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </>
      )}

      {/* Sort Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)} // Close the modal on back press
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)} // Close the modal when tapping outside
        >
          <View
            style={{
              width: 250,
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 20,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 20 }}>Sort By</Text>
            {['Category', 'Brand', 'Model'].map((choice, idx) => (
              <TouchableOpacity
                key={idx}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 5,
                  backgroundColor: '#eee',
                  marginBottom: 10,
                  width: '100%',
                  alignItems: 'center',
                }}
                onPress={() => {
                  setSortLabel(choice); // Update the button text immediately
                  setPendingSortLabel(choice); // Store the selected value temporarily
                  setIsModalVisible(false); // Close the modal
                }}
              >
                <Text style={{ color: '#444', fontSize: 16 }}>{choice}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
      
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


export default Xchange;