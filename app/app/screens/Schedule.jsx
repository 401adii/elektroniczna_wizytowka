import { View, Text, ScrollView, TextInput } from 'react-native'
import React, {useState} from 'react'
import {Table, Row} from 'react-native-table-component'
import Button from '../components/Button'

const MAX_CHARS = 20;
const MAX_COLUMNS = 8;
const MAX_ROWS = 10;
const CLEAR_STR = 'clear_table:1\n\r'

const Schedule = ({navigation, route}) => {

  const [headers, setHeaders] = useState(['','','']);
  const [rows, setRows] = useState([]);
  const [clear, setClear] = useState(false);

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
    return `1x:${columnCount-1}\n1y:${rowCount}\n`;
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
  for (let j = 1; j < headers.length; j++) {
    for (let i = 0; i < rows.length; i++) {
      if (j < rows[i].data.length) {
        const cellValue = rows[i].data[j];
        if (cellValue.trim() !== '') {
          result += `1${j}${i+1}:${cellValue}\n`;
        }
      }
    }
  }
  return result;
};

  const renderHeader = () => (
    <Row
      data={headers.map((header, index) => {
        if (index === 0) {
          return (
            <Text
              key={`header-${index}`}
              style={{minWidth: 100, padding: 10, fontWeight: 'bold', textAlign: 'center'}}
            >
              {' '}
            </Text>
          );
        }
        return (
          <TextInput
            key={`header-${index}`}
            value={header}
            onChangeText={text => updateHeader(index, text)}
            maxLength={MAX_CHARS}
            style={{minWidth: 100, padding: 10, fontWeight: 'bold', textAlign: 'center'}} 
          />
        );
      })}
      style={{height: 40}}
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
          style={{minWidth: 100, padding: 10, textAlign: 'center'}}
          />
      ))}
    style={{minHeigth: 40}}/>))
  )

  return (
    <View className='flex-1 p-5'>
      <View className='flex-1 mb-10'>
        <ScrollView horizontal>
          <ScrollView className='flex-1'>
            <Table borderStyle={{borderWidth: 1, padding:5}}>
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
          <Button text={`clear data: ${clear ? 'yes' : 'no'}`} onPress={() => setClear(!clear)}/>
          <Button text="confirm" onPress={() => {
            const flag = (clear ? CLEAR_STR : "")
            const dimensionsString = getTableDimensionsString();
            const columnString = getFirstColumnValuesString();
            const headerString = getHeadersString();
            const cellString = getCellsString();
            const data = flag + dimensionsString + headerString + columnString + cellString
            console.log(data)
            if (route.params?.onConfirm){
              route.params.onConfirm(data + '\n\r')
            }
            navigation.goBack();}}/>
        </View>
      </View>
    </View>
  )
}

export default Schedule