import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

export default forwardRef((props,ref) => {
    const [minValue, setMinValue] = useState('');
    const [maxValue, setMaxValue] = useState('');
  useEffect(() => {
    props.filterChangedCallback();
  }, [minValue, maxValue]);
  
  const handleMinValueChange = (event) => {
    setMinValue(event.target.value);
  };
  
  const handleMaxValueChange = (event) => {
    setMaxValue(event.target.value);
  };
  useImperativeHandle(ref, ()=>{
        return {
            doesFilterPass(params) {
              const cellValue = params.data[props.column.colId];
              if (minValue && cellValue < minValue) {
                return false;
              }
              if (maxValue && cellValue > maxValue) {
                return false;
              }
              return true;
            },
            
            isFilterActive(){
              return minValue !== '' || maxValue !== '';
            },
            
            getModel(){
              return { minValue, maxValue };
            },
            
            setModel(model){
                // setMinValue(model.minValue);
                // setMaxValue(model.maxValue);
            }

        }
    })

  return (
    <div className='Time_filter_wrapper'>
      <input type="text" value={minValue} className='Time_filter_input' placeholder='Time start' onChange={handleMinValueChange} />
      <input type="text" value={maxValue} className='Time_filter_input' placeholder='Time end' onChange={handleMaxValueChange} />
      <button className='Clear_time_filter_btn' onClick={()=>{setMinValue('');setMaxValue('');}}>Clear</button>
    </div>
  );
});

