import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Button, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';  // Utilisation de Print au lieu de RNHTMLtoPDF

export default function RecapScreen({ route }) {
  const [soldItems, setSoldItems] = useState([]);

  useEffect(() => {
    if (route.params?.soldItems) {
      setSoldItems(route.params.soldItems);
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

  // Générer et télécharger le fichier PDF avec Print
  const generatePDF = async () => {
    try {
      const htmlContent = generatePdfContent();

      // Utilisation de Print pour générer le PDF
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      // Partager ou enregistrer le fichier PDF
      if (uri) {
        await Sharing.shareAsync(uri);
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