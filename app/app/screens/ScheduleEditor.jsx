import { View, ScrollView } from 'react-native';
import { Table, Rows } from 'react-native-table-component';
import Input from '../components/Input';
import Button from '../components/Button';
import React, { useState, useEffect } from 'react';

const ScheduleEditor = () => {
  const [rows, setRows] = useState(1);
  const [cols, setCols] = useState(1);
  const [inputArray, setInputArray] = useState([]);

  const updateArray = (newRows, newCols) => {
    setInputArray(prevArray => {
      const updatedArray = Array.from({ length: newRows }, (_, rowIndex) =>
        Array.from({ length: newCols }, (_, colIndex) => {
          return prevArray[rowIndex]?.[colIndex] || <Input key={`${rowIndex}-${colIndex}`} />;
        })
      );
      return updatedArray;
    });
  };

  const handleAddRow = () => {
    setRows(prevRows => {
      const newRows = prevRows + 1;
      updateArray(newRows, cols);
      return newRows;
    });
  };

  const handleAddColumn = () => {
    setCols(prevCols => {
      const newCols = prevCols + 1;
      updateArray(rows, newCols);
      return newCols;
    });
  };

  const handleRemoveRow = () => {
    setRows(prevRows => {
      
      if(prevRows === 1)
        return 1;
      
      const newRows = prevRows - 1;
      updateArray(newRows, cols);
      return newRows;
    });
  };
  
  const handleRemoveColumn = () => {
    setCols(prevCols => {
      
      if(prevCols === 1)
        return 1;
      
      const newCols = prevCols - 1;
      updateArray(rows, newCols);
      return newCols;
    });
  };

  useEffect(() => {
    updateArray(rows, cols);
  }, [rows, cols]);

  return (
    <View>
      <ScrollView horizontal>
        <ScrollView>
          <Table>
            <Rows data={inputArray} />
          </Table>
        </ScrollView>
      </ScrollView>
      <Button text='add row' onPress={handleAddRow} />
      <Button text='remove row' onPress={handleRemoveRow} />
      <Button text='add column' onPress={handleAddColumn} />
      <Button text='remove column' onPress={handleRemoveColumn} />
    </View>
  );
};

export default ScheduleEditor;
