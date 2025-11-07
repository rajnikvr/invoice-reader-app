import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
const formatKey = (key) => {
  if (!key) return "";
  let formatted = key.replace(/[_\-]+/g, " ");
  formatted = formatted.replace(/([a-z])([A-Z])/g, "$1 $2");
  formatted = formatted
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
  return formatted.trim();
};


const DynamicDataRenderer = ({ data }) => {
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
    const headers = Object.keys(data[0]);

    return (
      <ScrollView horizontal bounces={false}>
        <View>
          <View style={styles.tableRowHeader}>
            {headers.map((header) => (
              <Text key={header} style={[styles.tableCell, styles.headerText]}>
                {formatKey(header)}
              </Text>
            ))}
          </View>
          {data.map((item, index) => (
            <View key={index} style={[styles.tableRow, index % 2 === 1 && styles.alternatingRow]}>
              {headers.map((header) => (
                <View key={header} style={styles.tableCell}>
                  <DynamicDataRenderer data={item[header]} />
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }

  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    return (
      <View style={styles.objectContainer}>
        {Object.entries(data).map(([key, value]) => (
          <View key={key} style={styles.keyValueRow}>
            <Text style={styles.keyText}>{formatKey(key)}:</Text>
            <View style={styles.valueContainer}>
              <DynamicDataRenderer data={value} />
            </View>
          </View>
        ))}
      </View>
    );
  }
  
  if(Array.isArray(data)) {
      return (
        <View>
            {data.map((item, index) => <Text key={index} style={styles.valueText}>• {String(item)}</Text>)}
        </View>
      )
  }

  return <Text style={styles.valueText}>{String(data)}</Text>;
};


const styles = StyleSheet.create({
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#e9ecef',
    borderBottomWidth: 2,
    borderColor: '#dee2e6',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
  },
  alternatingRow: {
    backgroundColor: '#f8f9fa',
  },
  tableCell: {
    padding: 10,
    minWidth: 120,
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    color: '#333',
  },

  objectContainer: {
    paddingVertical: 5,
  },
  keyValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  keyText: {
    fontWeight: 'bold',
    marginRight: 8,
    color: '#555',
  },
  valueContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },

  valueText: {
    color: '#212529',
  },
});

export default DynamicDataRenderer;