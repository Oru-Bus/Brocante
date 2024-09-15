import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

export default function CreateObjectScreen({ navigation }) {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');

  const addItem = () => {
    if (itemName && itemPrice) {
      const newItem = {
        id: Date.now(),
        name: itemName,
        price: parseFloat(itemPrice),
        sold: false
      };

      // Navigation vers HomeScreen avec le nouvel objet
      navigation.navigate('Objets à vendre', { newItem });
      
      // Réinitialiser les champs après ajout
      setItemName('');
      setItemPrice('');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Nom de l'objet"
        value={itemName}
        onChangeText={setItemName}
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <TextInput
        placeholder="Prix"
        value={itemPrice}
        onChangeText={setItemPrice}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Button title="Ajouter un objet" onPress={addItem} />
    </View>
  );
}