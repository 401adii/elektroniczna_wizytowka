import { View, Text, ScrollView, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Table, Row } from 'react-native-table-component'
import Button from '../components/Button'

const MAX_CHARS = 20;
const MAX_COLUMNS = 7; // Added max columns constant
const MAX_ROWS = 10;

const Schedule = () => {
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);

  const addColumn = () => {
    if (headers.length >= MAX_COLUMNS) return;
    
    // Add new header
    setHeaders(prev => [...prev, '']);
    
    // Add new empty cell to each row
    setRows(prev => prev.map(row => ({
      ...row,
      data: [...(row.data || []), '']
    })));
  }

  const removeColumn = () => {
    if (headers.length === 0) return;
    
    // Remove last header
    setHeaders(prev => prev.slice(0, -1));
    
    // Remove last cell from each row
    setRows(prev => prev.map(row => ({
      ...row,
      data: row.data.slice(0, -1)
    })));
  }

  const addRow = () => {
    if (rows.length >= MAX_ROWS) return;
    
    // Create new row with empty cells for each column
    const newRow = {
      data: Array(headers.length).fill('')
    };
    
    setRows(prev => [...prev, newRow]);
  }

  const removeRow = () => {
    if (rows.length === 0) return;
    setRows(prev => prev.slice(0, -1));
  }

  const updateHeader = (index, text) => {
    if (text.length > MAX_CHARS) return;
    setHeaders(prev => prev.map((header, i) => 
      i === index ? text : header
    ));
  }

  const updateCell = (rowIndex, cellIndex, text) => {
    if (text.length > MAX_CHARS) return;
    
    setRows(prev => prev.map((row, rIndex) => {
      if (rIndex === rowIndex) {
        const newData = [...row.data];
        newData[cellIndex] = text;
        return { ...row, data: newData };
      }
      return row;
    }));
  }

  const renderHeader = () => (
    <Row
      data={headers.map((header, index) => (
        <TextInput
          key={`header-${index}`}
          value={header}
          onChangeText={text => updateHeader(index, text)}
          maxLength={MAX_CHARS}
          style={styles.headerInput}
          placeholder={`Col ${index + 1}`}
        />
      ))}
      style={styles.header}
    />
  )

  const renderRows = () => (
    rows.map((row, rowIndex) => (
      <Row
        key={`row-${rowIndex}`}
        data={row.data.map((cell, cellIndex) => (
          <TextInput
            key={`cell-${rowIndex}-${cellIndex}`}
            value={cell}
            onChangeText={text => updateCell(rowIndex, cellIndex, text)}
            maxLength={MAX_CHARS}
            style={styles.cellInput}
            placeholder={`R${rowIndex + 1}C${cellIndex + 1}`}
          />
        ))}
        style={styles.row}
      />
    ))
  )

  return (
    <View style={styles.container}>
      <View style={styles.tableContainer}>
        <ScrollView horizontal>
          <ScrollView>
            <Table borderStyle={styles.border}>
              {renderHeader()}
              {renderRows()}
            </Table>
          </ScrollView>
        </ScrollView>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button text="Add Row" onPress={addRow} disabled={rows.length >= MAX_ROWS} />
        <Button text="Remove Row" onPress={removeRow} disabled={rows.length === 0} />
        <Button text="Add Column" onPress={addColumn} disabled={headers.length >= MAX_COLUMNS} />
        <Button text="Remove Column" onPress={removeColumn} disabled={headers.length === 0} />
      </View>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Columns: {headers.length}/{MAX_COLUMNS}</Text>
        <Text style={styles.statusText}>Rows: {rows.length}/{MAX_ROWS}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  tableContainer: {
    flex: 1,
    marginBottom: 16
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16
  },
  statusText: {
    color: '#666',
    fontSize: 14
  },
  border: {
    borderWidth: 1,
    borderColor: '#ddd'
  },
  header: {
    height: 40,
    backgroundColor: '#f0f8ff'
  },
  row: {
    minHeight: 40
  },
  headerInput: {
    minWidth: 100,
    padding: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    borderBottomWidth: 2,
    borderColor: '#a0c6ff'
  },
  cellInput: {
    minWidth: 100,
    padding: 10,
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: '#eee'
  }
});

export default Schedule