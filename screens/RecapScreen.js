import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RecapScreen({ route }) {
  const [soldItems, setSoldItems] = useState([]);

  // Charger les objets vendus depuis le stockage local
  useEffect(() => {
    const loadSoldItems = async () => {
      try {
        const storedSoldItems = await AsyncStorage.getItem('soldItems');
        if (storedSoldItems) {
          setSoldItems(JSON.parse(storedSoldItems));
        }
      } catch (error) {
        console.log('Erreur lors du chargement des objets vendus', error);
      }
    };
    loadSoldItems();
  }, []);

  // Sauvegarder les objets vendus dans le stockage local
  useEffect(() => {
    if (route.params?.soldItems) {
      const updatedSoldItems = route.params.soldItems;
      setSoldItems(updatedSoldItems);

      const saveSoldItems = async () => {
        try {
          await AsyncStorage.setItem('soldItems', JSON.stringify(updatedSoldItems));
        } catch (error) {
          console.log('Erreur lors de la sauvegarde des objets vendus', error);
        }
      };
      saveSoldItems();
    }
  }, [route.params?.soldItems]);

  const totalPriceExpected = soldItems.reduce((sum, item) => sum + item.price, 0);
  const totalPriceSold = soldItems.reduce((sum, item) => sum + (item.soldPrice || item.price), 0);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text>{item.name} - {item.soldPrice || item.price}€</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text>Total attendu : {totalPriceExpected}€</Text>
      <Text>Total vendu : {totalPriceSold}€</Text>

      <FlatList
        data={soldItems}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  }
});