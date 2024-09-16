import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

export default function RecapScreen({ route }) {
  const [soldItems, setSoldItems] = useState([]);

  // Charger les objets vendus depuis AsyncStorage à l'ouverture de la page
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

  // Mettre à jour la liste si elle est passée depuis HomeScreen
  useEffect(() => {
    if (route.params?.soldItems) {
      setSoldItems(route.params.soldItems);

      // Sauvegarder la nouvelle liste dans AsyncStorage
      try {
        AsyncStorage.setItem('soldItems', JSON.stringify(route.params.soldItems));
      } catch (error) {
        console.log('Erreur lors de la sauvegarde des objets vendus', error);
      }
    }
  }, [route.params?.soldItems]);

  const totalPriceExpected = soldItems.reduce((sum, item) => sum + item.price, 0);
  const totalPriceSold = soldItems.reduce((sum, item) => sum + (item.soldPrice || item.price), 0);

  // Générer le contenu HTML du PDF
  const generatePdfContent = () => {
    let itemsHtml = soldItems.map(item => {
      return `<p>${item.name} - ${item.soldPrice || item.price}€</p>`;
    }).join('');

    return `
      <h1>Récapitulatif des objets vendus</h1>
      <p>Total attendu : ${totalPriceExpected}€</p>
      <p>Total vendu : ${totalPriceSold}€</p>
      <h2>Détails des objets vendus :</h2>
      ${itemsHtml}
    `;
  };

  // Générer et télécharger le fichier PDF
  const generatePDF = async () => {
    try {
      const htmlContent = generatePdfContent();

      const options = {
        html: htmlContent,
        fileName: 'recapitulatif_ventes',
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);

      // Partager ou enregistrer le fichier PDF
      if (file && file.filePath) {
        await Sharing.shareAsync(file.filePath);
      } else {
        Alert.alert("Erreur", "Échec de la création du fichier PDF");
      }
    } catch (error) {
      console.error("Erreur lors de la création du PDF :", error);
      Alert.alert("Erreur", "Impossible de créer le PDF");
    }
  };

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

      {/* Bouton pour générer le PDF */}
      <Button title="Télécharger le PDF" onPress={generatePDF} />
    </View>
  );
}