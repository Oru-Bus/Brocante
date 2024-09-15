import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Button, TextInput, Modal } from 'react-native';

export default function HomeScreen({ route, navigation }) {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [soldPrice, setSoldPrice] = useState('');

  // Mise à jour des objets lorsqu'on revient du CreateObjectScreen
  useEffect(() => {
    if (route.params?.newItem) {
      setItems([...items, route.params.newItem]);
    }
  }, [route.params?.newItem]);

  // Ouvre la modal pour entrer le prix de vente
  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  // Fermer la modal et enregistrer le prix de vente
  const handleSellItem = () => {
    if (soldPrice) {
      const updatedItems = items.map(item =>
        item.id === selectedItem.id ? { ...item, sold: true, soldPrice: parseFloat(soldPrice) } : item
      );
      setItems(updatedItems);
      setSoldPrice('');
      setModalVisible(false);

      // Naviguer vers la page de récapitulatif
      navigation.navigate("Récapitulatif", { soldItems: updatedItems.filter(item => item.sold) });
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) && !item.sold
  );

  const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
      <Text>{item.name} - {item.price}€</Text>
      <Button title="Vendu" onPress={() => openModal(item)} />
    </View>
  );

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Rechercher un objet"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      
      {/* Liste des objets filtrés */}
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />

      {/* Modal pour entrer le prix de vente */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
            <Text>Prix de vente pour {selectedItem?.name}</Text>
            <TextInput
              placeholder="Prix de vente"
              value={soldPrice}
              onChangeText={setSoldPrice}
              keyboardType="numeric"
              style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <Button title="Annuler" onPress={() => setModalVisible(false)} />
              <Button title="OK" onPress={handleSellItem} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}