import React, { useEffect, useState, useContext } from 'react';

import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, Legend, ResponsiveContainer, Brush  } from 'recharts';
import 'leaflet/dist/leaflet.css'



import moment from 'moment';
import Loading from '../ui/Loading';

const domain = {
  'um/m3': [0 , 30],
  'ppm': [0, 1500]
}

export const IPIEstacionScreen = () => {
  const sensors = ['1','2','3','4','5','6','7','8','9','10'];
  const measures = ['pm','co2'];
  const [sensor, setSensor] = useState(measures[0]);
  const [sensorData, setSensorData] = useState([]);
  const [measure, setMeasure] = useState('');
  const [loading, setLoading] = useState(false);
  const [sensorSelected, setSensorSelected] = useState("")

  const getData = async() => {
    try {
      setLoading(true)
      const res=await fetch(`http://youilab.ipicyt.edu.mx/ipiestacion/${sensorSelected}/${sensor}?last=50`)
      const {data} = await res.json()
      console.log({data})
      if (data.length === 0) {
        setDataDown(true)
        return
      }
      setSensorData(data)
      setLoading(false)
    } catch (error) {
      setDataDown(true)
      setLoading(false)
      console.log(error)
    }

  }
  

  useEffect(() => {
    getData()
  }, [sensorSelected, sensor]);


  

  

  const CustomizedAxisTick = ({ x, y, payload }) => {
    const dateTip = moment.unix(payload.value/1000)
      .format("l")
      
       return (
      <g transform={`translate(${x},${y})`}>
     <text x={23} y={0} dy={14} fontSize="0.90em" fontFamily="bold" textAnchor="end" fill="#fff">
       {dateTip}</text>
      </g>
     );
  };
  const CustomTooltip = ({ active, payload, label }) => {
    const dateTip = moment.unix(label/1000)
      .format("lll")
    const formattedDate = dateTip
    if (payload === null || payload === []) return
    if (active)
      return (
     <div className="custom-tooltip">
       <p className="label-tooltip">{`${formattedDate}`}</p>
       <p className="desc-tooltip">
      <span className="value-tooltip">Valor: {payload[0]?.value.toLocaleString()}</span>
       </p>
     </div>
      );
    return null;
  };

  const xAxisTickFormatter = (timestamp_measured) => {
    return moment.unix(timestamp_measured/1000)
      .format("lll")
  }


  const downloadFile = ({ data, fileName, fileType }) => {
    // Create a blob with the data we want to download as a file
    const blob = new Blob([data], { type: fileType })
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement('a')
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
  }
  

  const [downloadType, setDownloadType] = useState('all');
  const [formatType, setFormatType] = useState('csv');
  const [dataDown, setDataDown] = useState(false);
  const exportToJson = e => {
    setDataDown(false)
    let data = []
    if (downloadType==='hour') {
      const now = moment().unix();

      data = sensorData.filter(data => Number( data.Tiempo) >= (now-3600) )
      console.log(data);
    }else if (downloadType==='last100'){
       data = sensorData.slice(-100);

      
    }else {
      data = sensorData
    }

    if (data.length !== 0){
      e.preventDefault()
      downloadFile({
        data: JSON.stringify(sensorData),
        fileName: `${sensorData[0].Sensor}_${downloadType}.json`,
        fileType: 'text/json',
      })
    }else{
      setDataDown(true)
    }
  }
  const createCSV = (data)=>{
      const items = data
      const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
       
      let header  = Object.keys(items[0]).filter(function(item) {
        return item !== '_id' && item !== 'Sensor'
      })
      const newHeader = header.map(h=> h.replace(',', ''))
      console.log(header)
      const csv = [
        newHeader.join(','), // header row first
        ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
      ].join('\r\n')
      return csv
  }
  const exportToCSV = e => {
   

    if (sensorData.length === 0) {
      setDataDown(true)
      return
    }

    setDataDown(false)
    let data = []
    let csv 
    if (downloadType==='hour') {
      const now = moment().unix();

      data = sensorData.filter(d => Number( d.Tiempo) >= (now-3600) )
      data = data.map(v=>{
        
        return {
          ...v,
          Tiempo:moment.unix(Number(v.Tiempo)/1000).format("DD/MM/YYYY HH:mm:ss"),
          
        }
      })
      csv = createCSV(data)
      
      console.log(csv)
      
    }else if (downloadType==='last100'){
      data = sensorData.slice(-100);
      data = data.map(v=>{
        return {
          ...v,
          Tiempo:moment.unix(Number(v.Tiempo)/1000).format("DD/MM/YYYY HH:mm:ss"),
        }
      })
      csv = createCSV(data)      
    }else {
      data = sensorData
      data = data.map(v=>{
        console.log(v)
        return {
          ...v,
          Tiempo:moment.unix(v.Tiempo/1000).format("DD/MM/YYYY HH:mm:ss"),
        }
      })
      csv = createCSV(data)      
    }

    if (data.length !== 0){
      e.preventDefault()
      console.log(data)
      console.log(csv)
      downloadFile({
        data: csv,
        fileName: `${sensorData[0].Sensor}_${downloadType}.csv`,
        fileType: 'text/csv',
      })
    }else{
      setDataDown(true)
    }
  }

  const handleSelectSensor = (e) =>{
    setSensorSelected(e.target.value)
    setMeasure('')

  }

  const handleChangeDownload = (e) => {
    setDownloadType(e.target.value)
  }
  const handleFormatDownload = (e) => {
    setFormatType(e.target.value)
  }

  const handleDownload = (e)=>{
    if (formatType == 'csv') {
      exportToCSV(e)
    }else{
      exportToJson(e)
    }
  }

  function hasNumber(myString) {
    return /\d/.test(myString);
  }




  return <>
    <>
    <h1 className='sensor-name'>IPIESTACION {sensor.metadata}</h1>

    <div className="select-sensor">
      <h4>Sensor</h4>
      <select name="" id="" onChange={handleSelectSensor} style={{padding: ".5rem 1rem"}}>
        {
          sensors.map(sensor=> (
            <option value={sensor} >
               IPIESTACION {sensor}
            </option>)
          )
        }
      </select>
      <select name="" id="" onChange={(e)=>setSensor(e.target.value)} value={sensor} style={{padding: ".5rem 1rem"}}>
        {
          measures.map(m=> (
            <option value={m} >
               {m.toUpperCase()}
            </option>)
          )
        }
      </select>
      {
        loading &&
        <Loading />
      }
    </div>
    
   
    <hr />
    <br />


    <div className="actions">
      <h3>Descargar datos</h3>
      <select name="formato" id="format" onChange={handleFormatDownload} style={{padding: ".5rem 1rem"}}>
        <option value="json">JSON</option>
        <option value="csv" defaultValue>CSV</option>
      </select>
      <select name="" id="" onChange={handleChangeDownload} style={{padding: ".5rem 1rem"}}>
        <option value="all" defaultValue>Todos los datos</option>
        <option value="hour">Ultima Hora</option>
        {/* <option value="last100">Ultimos 100 registros</option> */}
      </select>
      <button disabled={loading} onClick={handleDownload} className="btn btn-primary" style={{background:" var(--titulo-form-input)"}} >
        Descargar
      </button>
    </div>
    <h4>
      {dataDown && "No hay datos que cumplan estos parametros"}
    </h4>

    <hr /><br />
   
    
    </>
  
      
  </>;
};
