import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome'; // Ensure you have this installed: npm install react-native-vector-icons

const API_URL_DETAILS = 'https://pk9blqxffi.execute-api.us-east-1.amazonaws.com/xdeal/XchangeDetails';
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJuYmYiOjE3NDYxOTI1MTQsImV4cCI6MTc0ODc4NDUxNCwiaXNzIjoiWHVyMzRQMSIsImF1ZCI6Ilh1cjQ0UFAifQ.QD-fcLXtznCfkTIYkbOQfc5fXfxYgw_mOziKWpUHddk";

const ItemDetails = ({ route }) => {
  const { item } = route.params;
  const [detailedItem, setDetailedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSpecification, setShowSpecification] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showProvenance, setShowProvenance] = useState(false);

  useEffect(() => {
    const fetchItemDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(API_URL_DETAILS, {
          current_owner_id: item.lister_id,
          current_owner_type: item.lister_type,
          item_id: item.item_id,
          listing_id: item.listing_id,
          token: TOKEN,
          user_type: 'Xpert',
          version_number: '2.2.6',
        });
        console.log('Detailed Item Response:', response.data);
        if (response.data && response.data.item_details && response.data.item_details.length > 0) {
          setDetailedItem(response.data);
        } else {
          setError('Could not retrieve item details.');
        }
      } catch (err) {
        console.error('Error fetching item details:', err);
        setError('Failed to fetch item details.');
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [item.item_id, item.listing_id, item.lister_id, item.lister_type]);

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#0a7" /></View>;
  }

  if (error) {
    return <View style={styles.errorContainer}><Text style={styles.errorText}>{error}</Text></View>;
  }

  if (!detailedItem || !detailedItem.item_details || detailedItem.item_details.length === 0) {
    return <View><Text>No details found for this item.</Text></View>;
  }

  const itemDetails = detailedItem.item_details[0];
  const listerDetails = detailedItem.lister_details;
  const itemImages = detailedItem.item_images || [];
  const specification = detailedItem.specification || [];
  const provenance = detailedItem.provenance || [];
  const descriptionText = (detailedItem.description && detailedItem.description.length > 0) ? detailedItem.description[0].description : '';

  // Find currency from specification
  const currencySpec = specification.find(spec => spec.label === 'Currency');
  const currency = currencySpec ? currencySpec.value : itemDetails.currency || 'N/A';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Card with Image and Basic Details */}
      <View style={styles.card}>
        {itemImages.length > 0 && (
          <Image source={{ uri: itemImages[0].image_link }} style={styles.image} />
        )}
        <Text style={[styles.text, styles.largeText, styles.gray]}>
          {itemDetails.model?.toUpperCase()}
        </Text>
        <Text style={[styles.text, styles.largeText, styles.black]}>
          {itemDetails.category?.toUpperCase()}
        </Text>
        <Text style={[styles.text, styles.largeText, styles.gold]}>
          {`${itemDetails.currency} ${itemDetails.selling_price}`.toUpperCase()}
        </Text>
      </View>


      {/* Lister Info */}
      {listerDetails && (
        <View style={styles.listerCard}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImageInner}>
              {listerDetails.individual_profile_picture && (
                <Image
                  source={{ uri: listerDetails.image_link }}
                  style={styles.profileImage}
                />
              )}
            </View>
          </View>
          <View style={styles.listerInfoTextContainer}>
            <Text style={styles.listerInfoText}>
              <Text style={styles.listerInfoLabel}></Text> {listerDetails.username}
            </Text>
            <Text style={styles.listerInfoText}>
              <Text style={styles.listerInfoLabel}></Text> {listerDetails.xpert_code}
            </Text>
            <Text style={styles.listerInfoText}>
              <Text style={styles.listerInfoLabel}></Text> {`${listerDetails.state}, ${listerDetails.country}`}
            </Text>
            <Text style={styles.listerInfoText}>
              <Text style={styles.listerInfoLabel}></Text> {new Date(listerDetails.date_created).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </Text>
          </View>
        </View>
      )}

    {/* Specification Card */}
    <View style={styles.dropdownCard}>
        <TouchableOpacity style={styles.dropdownHeader} onPress={() => setShowSpecification(!showSpecification)}>
          <Text style={styles.sectionTitle}>Specification</Text>
          <Icon name={showSpecification ? 'chevron-up' : 'chevron-down'} size={16} color="#333" />
        </TouchableOpacity>
        {showSpecification && (
          <View style={styles.dropdownContent}>
            {specification.map((spec, index, array) => {
              if (spec.label === 'Currency') {
                return null;
              }
              const labelText = spec.label + '';
              const valueText = spec.label === 'Appraised Value' ? `${currency} ${spec.value}` : spec.value;
              return (
                <View key={spec.specification_id}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{labelText}</Text>
                    <Text style={styles.infoValue}>{valueText}</Text>
                  </View>
                  {index < array.length - 1 && <View style={styles.separator} />}
                </View>
              );
            })}
          </View>
        )}
      </View>
   
      {/* Description Card */}
      <View style={styles.dropdownCard}>
        <TouchableOpacity style={styles.dropdownHeader} onPress={() => setShowDescription(!showDescription)}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Icon name={showDescription ? 'chevron-up' : 'chevron-down'} size={16} color="#333" />
        </TouchableOpacity>
        {showDescription && (
          <View style={styles.dropdownContent}>
            <Text style={[styles.text, styles.leftAlign]}>{descriptionText}</Text>
          </View>
        )}
      </View>
{/* Provenance Card */}
<View style={styles.dropdownCard}>
        <TouchableOpacity style={styles.dropdownHeader} onPress={() => setShowProvenance(!showProvenance)}>
          <Text style={styles.sectionTitle}>Provenance</Text>
          <Icon name={showProvenance ? 'chevron-up' : 'chevron-down'} size={20} color="#555" />
        </TouchableOpacity>
        {showProvenance && (
          <View style={styles.dropdownContent}>
            {/* Provenance */}
            {provenance.filter(p => p.provenance_type === 'Registration').length > 0 && (
              <View style={styles.nestedSection}>
                <Text style={styles.nestedSectionTitle}>Provenance</Text>
                {provenance
                  .filter(p => p.provenance_type === 'Registration')
                  .map((p, index, array) => (
                    <View key={p.item_provenance_id}>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Date</Text>
                        <Text style={styles.infoValue}>
                          {p.date_created && new Date(p.date_created).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </Text>
                      </View>
                      <View style={styles.separator} />
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Registered by</Text>
                        <Text style={styles.infoValue}>{p.created_by_name}</Text>
                      </View>
                      {index < array.length - 1 && <View style={styles.separator} />}
                    </View>
                  ))}
              </View>
            )}

            {/* Certification */}
            {provenance.filter(p => p.provenance_type === 'Listed').length > 0 && (
              <View style={styles.nestedSection}>
                <Text style={styles.nestedSectionTitle}>Certification</Text>
                {provenance
                  .filter(p => p.provenance_type === 'Listed')
                  .map((p, index, array) => (
                    <View key={`cert-${p.item_provenance_id}`}>
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Date</Text>
                        <Text style={styles.infoValue}>
                          {p.date_created && new Date(p.date_created).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </Text>
                      </View>
                      <View style={styles.separator} />
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Type</Text>
                        <Text style={styles.infoValue}>{p.provenance_type}</Text>
                      </View>
                      <View style={styles.separator} />
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Certified by</Text>
                        <Text style={styles.infoValue}>{p.created_by_name}</Text>
                      </View>
                      <View style={styles.separator} />
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Control Number</Text>
                        <Text style={styles.infoValue}>{p.control_number}</Text>
                      </View>
                      {index < array.length - 1 && <View style={styles.separator} />}
                    </View>
                  ))}
              </View>
            )}
          </View>
        )}
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 40,
    marginLeft: -20,
    marginRight: -20,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 20,
    elevation: 4,
    borderRadius: 8,
  },
  image: {
    marginTop: '-20',
    marginLeft: '-30',
    width: '450',
    height: 300,
    marginBottom: 15,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dropdownCard: {
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
    overflow: 'hidden', // To contain the rounded borders
    marginLeft: -5,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  dropdownContent: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: 'white', // Light background for content
  },
  nestedSection: {
    marginTop: 15,
    paddingLeft: 10, // Indent nested sections
  },
  nestedSectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
    color: '#555',
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  gray: {
    color: '#888',
    fontWeight: '600',
  },
  black: {
    color: '#000',
    fontWeight: '600',
  },
  gold: {
    color: '#e6b570',
    fontWeight: '600',
  },
  largeText: {
    fontSize: 18,
  },
  separator: {
    height: 2,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  listerCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 3,
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: '#e6b570',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  listerInfoTextContainer: {
    marginLeft: 16,
  },
  listerInfoText: {
    fontSize: 16,
    marginBottom: 2,
    color: '#555',
    textAlign: 'left',
  },
  listerInfoLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  provenanceItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  certificationItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  leftAlign: {
    textAlign: 'left',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    color: '#333',
    fontSize: 16,
    textAlign: 'left',
    flex: 1,
    marginRight: 10,
  },
  infoValue: {
    color: '#555',
    fontSize: 16,
    textAlign: 'right',
    flex: 1,
  },
});

export default ItemDetails;