import { View, Text, ScrollView, TextInput } from 'react-native'
import React, {useState} from 'react'
import {Table, Row} from 'react-native-table-component'
import Button from '../components/Button'

const MAX_CHARS = 20;
const MAX_COLUMNS = 8;
const MAX_ROWS = 10;

const Schedule = ({navigation, route}) => {

  const [headers, setHeaders] = useState(['','','']);
  const [rows, setRows] = useState([]);

  const addColumn = () => {
    if(headers.length >= MAX_COLUMNS) return;
      setHeaders(prev => [...prev, ''])
      setRows(prev => prev.map(row => ({
        ...row,
        data: [...(row.data || []), '']
      })))
  }

  const removeColumn = () => {
    if(headers.length === 0) return;

    setHeaders(prev => prev.slice(0, -1));

    setRows(prev => prev.map(row => ({
      ...row, data: row.data.slice(0, -1)
    })));
  }

  const addRow = () => {
    if(rows.length >= MAX_ROWS) return;

    const newRow = {
      data: Array(headers.length).fill('')
    };

    setRows(prev => [...prev, newRow]);
  }

  const removeRow = () => {
    if(rows.length === 0) return;
    setRows(prev => prev.slice(0, -1));
  }

  const updateHeader = (index, text) => {
    if(text.length > MAX_CHARS) return;
    setHeaders(prev => prev.map((day, i) =>
      i === index ? text : day
    ));
  }

  const updateCell = (rowIndex, cellIndex, text) => {
    if(text.length > MAX_CHARS) return;

    setRows(prev => prev.map((row, rIndex) => {
      if (rIndex === rowIndex){
        const newData = [...row.data];
        newData[cellIndex] = text;
        return {...row, data: newData};
      }
      return row;
    }))
  }

  const getTableDimensionsString = () => {
    const columnCount = headers.length;
    const rowCount = rows.length;
    return `1X:${columnCount}\n1Y:${rowCount}\n`;
  }

  const getHeadersString = () => {
  return headers
    .map((header, index) => {
      if (header.trim() !== '') { 
        return `1hC${index}:${header}\n`;
      }
      return '';
    })
    .filter(line => line !== '')  
    .join('');
};

const getFirstColumnValuesString = () => {
  let result = '';
  
  rows.forEach((row, rowIndex) => {
    if (row.data.length > 0 && row.data[0] && row.data[0].trim() !== '') {
      result += `1hR${rowIndex + 1}:${row.data[0]}\n`;
    }
  });
  
  return result;
};

const getCellsString = () => {
  let result = '';
  
  rows.forEach((row, rowIndex) => {
    // Skip header row (rowIndex 0) and process only data rows
    if (rowIndex === 0) return;
    
    row.data.forEach((cell, colIndex) => {
      // Skip column index 0 (first column)
      if (colIndex === 0) return;
      
      if (cell.trim() !== '') {
        result += `1${colIndex}${rowIndex}:${cell}\n`;
      }
    });
  });
  
  return result;
};

  const renderHeader = () => (
    <Row
      data={headers.map((header, index) => (
        <TextInput
        key={`header-${index}`}
        value={header}
        onChangeText={text => updateHeader(index, text)}
        maxLength={MAX_CHARS}
        style={{minWidth: 100, padding: 10, fontWeight: 'bold', textAlign: 'center'}}
        placeHolder={`Col ${index + 1}`}
        />
      ))}
    style={{heigth: 40}}/>
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
          style={{minWidth: 100, padding: 10, textAlign: 'center'}}
          />
      ))}
    style={{minHeigth: 40}}/>))
  )

  return (
    <View className='flex-1 p-5'>
      <View className='flex-1 mb-10'>
        <ScrollView horizontal>
          <ScrollView>
            <Table borderStyle={{borderWidth: 1}}>
              {renderHeader()}
              {renderRows()}
            </Table>
          </ScrollView>
        </ScrollView>
      </View>
      <View className='flex-wrap flex-row justify-center items-center'>
        <View className='items-center justify-center gap-2 flex-1'>
          <Button text="add row" onPress={addRow}/>
          <Button text="remove row" onPress={removeRow}/>
          <Button text="add column" onPress={addColumn}/>
          <Button text="remove column" onPress={removeColumn}/>
        </View>
        <View className='items-center justify-center gap-2 flex-1'>
          <Button text="clear table" onPress={() => {}}/>
          <Button text="confirm" onPress={() => {
            const dimensionsString = getTableDimensionsString();
            const columnString = getFirstColumnValuesString();
            const headerString = getHeadersString();
            const cellString = getCellsString();
            console.log(dimensionsString + headerString + columnString + cellString)
            if (route.params?.onConfirm){
              route.params.onConfirm(dimensionsString + headerString + columnString +  cellString + '\n\r')
            }
            navigation.goBack();}}/>
        </View>
      </View>
    </View>
  )
}

export default Schedule