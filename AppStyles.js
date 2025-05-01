import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    header: {
      backgroundColor: '#0a7',
      paddingTop: 50,
      paddingBottom: 15,
      paddingHorizontal: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      color: '#fff',
      fontSize: 35,
      fontWeight: 'bold',
    },
    searchContainer: {
      backgroundColor: '#fff',
      margin: 10,
      borderRadius: 25,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingVertical: 8,
      elevation: 2,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: '#333',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 10,
      margin: 5,
      flex: 1,
      elevation: 2,
      maxWidth: '48%',
      overflow: 'hidden',
    },
    cardImage: {
      width: '100%',
      height: 140,
    },
    cardContent: {
      padding: 10,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    cardSubtitle: {
      fontSize: 14,
      color: '#444',
    },
    cardCategory: {
      fontSize: 13,
      color: '#888',
      marginVertical: 2,
    },
    cardPrice: {
      fontSize: 16,
      fontWeight: '600',
      color: '#0a7',
      marginVertical: 6,
    },
    listerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 6,
    },
    listerImage: {
      width: 25,
      height: 25,
      borderRadius: 12.5,
      marginRight: 8,
    },
    listerName: {
      fontSize: 13,
      color: '#333',
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 60,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#ddd',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      elevation: 10,
    },
    footerItem: {
      alignItems: 'center',
    },
    footerText: {
      fontSize: 12,
      color: '#555',
      marginTop: 4,
    },
    loadMore: {
      backgroundColor: '#0a7',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 25,
      alignSelf: 'center',
      marginVertical: 20,
      elevation: 3,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
    },
    loadMoreText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
    },
    noMore: {
      padding: 15,
      textAlign: 'center',
      color: 'gray',
    },
  });

export default styles;