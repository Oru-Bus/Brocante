import React, { useState, useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';

export default function RecapScreen({ route }) {
  const [soldItems, setSoldItems] = useState([]);

  useEffect(() => {
    if (route.params?.soldItems) {
      setSoldItems(route.params.soldItems);
    }
  }, [route.params?.soldItems]);

  const totalPriceExpected = soldItems.reduce((sum, item) => sum + item.price, 0);
  const totalPriceSold = soldItems.reduce((sum, item) => sum + (item.soldPrice || item.price), 0);

  const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
      <Text>{item.name} - {item.soldPrice || item.price}€</Text>
    </View>
  );

  return (
    <View style={{ padding: 20 }}>
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