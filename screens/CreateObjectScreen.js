import React, { useState } from 'react';
import { View, Button, TextInput, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { PermissionsAndroid } from 'react-native';
import Papa from 'papaparse'; // Assuming you're using papaparse for CSV parsing

const CreateObjectScreen = ({ addItem }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  // Function to handle file selection and parsing
  const selectFile = async () => {
    try {
      // Request file access permission
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission denied', 'Cannot access files without permission');
        return;
      }

      // Open file picker
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.plainText],
      });

      // Read the CSV file and parse its contents
      const fileUri = res.uri;
      const response = await fetch(fileUri);
      const fileData = await response.text();

      // Parse the CSV content
      Papa.parse(fileData, {
        complete: (result) => {
          result.data.forEach(row => {
            const itemName = row[0];
            const itemPrice = row[1];
            if (itemName && itemPrice) {
              addItem(itemName, itemPrice); // Call addItem for each row
            }
          });
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        }
      });

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        Alert.alert('Error', 'Error selecting file');
        console.error(err);
      }
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Object Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Object Price"
        value={price}
        onChangeText={setPrice}
      />
      <Button
        title="Add Item"
        onPress={() => addItem(name, price)}
      />
      <Button
        title="Import from CSV"
        onPress={selectFile}
      />
    </View>
  );
};

export default CreateObjectScreen;