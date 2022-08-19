import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Brush  } from 'recharts';
import {  MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'
import Swal from 'sweetalert2'


import  axiosClient  from '../../config/axios';
import moment from 'moment';
import { ChangeNameContext } from '../../context/ChangeNameContext';

// const domain = {
//   'um/m3': [0 , 30],
//   'ppm': [0, 1500]
// }

export const SensorScreen = () => {
  const {id} = useParams();
  const [sensors, setSensors] = useState([]);
  const [user, setUser] = useState({});
  const [minMaxDate, setMinMaxDate] = useState({max:null, min: null})
  
  const getDateFromUnix = (unixDate)=>{
    const date = moment.unix(unixDate).format("YYYY-MM-DD")
    return date
  }
  const getMaxNMin = (data=[])=>{
    const dates = data.map(d=> d.datetime)
    const min = getDateFromUnix(Math.min(...dates.map(v=>Number(v))))
    const max = getDateFromUnix(Math.max(...dates.map(v=>Number(v))))
    
    return  {min, max}
  }

  
  const handleDelete = (e)=>{
    e.preventDefault()
    console.log('Borrado')
    Swal.fire({
      title: '¿Estas seguro que deseas borrar el sensor?',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: `Cancelar`,
    }).then(async(result) => {
      if (result.isConfirmed) {
        try {
          const {data}= await axiosClient.post(`/user/deleteSensor`, {serial:id})
          console.log(data)
          if (data.error) {
            Swal.fire('Error', data.error, 'error')
          }else{
            Swal.fire('Borrado', data.msg, 'success').then(()=>{
  
              window.location.reload()
            })

          }
        } catch (error) {
          Swal.fire('Error', error, 'error')
        }
      }
    })
  }
  //const datos = [{"datetime": "1642805219", "val": "30.73"},{"datetime": "1642805229", "val": "30.98"},{"datetime": "1642805239", "val": "30.68"},{"datetime": "1642805250", "val": "30.03"},{"datetime": "1642805260", "val": "30.22"},{"datetime": "1642805270", "val": "31.23"},{"datetime": "1642805280", "val": "31.28"},{"datetime": "1642805290", "val": "31.22"},{"datetime": "1642805300", "val": "31.69"},{"datetime": "1642805310", "val": "31.38"},{"datetime": "1642805320", "val": "30.91"},{"datetime": "1642805330", "val": "30.82"},{"datetime": "1642805341", "val": "31.27"},{"datetime": "1642805351", "val": "30.58"},{"datetime": "1642805361", "val": "29.61"},{"datetime": "1642805371", "val": "29.60"},{"datetime": "1642805381", "val": "29.62"},{"datetime": "1642805391", "val": "29.55"},{"datetime": "1642805401", "val": "30.59"},{"datetime": "1642805411", "val": "30.62"},{"datetime": "1642805421", "val": "30.44"},{"datetime": "1642805431", "val": "30.03"},{"datetime": "1642805441", "val": "30.46"},{"datetime": "1642805451", "val": "30.55"},{"datetime": "1642805461", "val": "30.83"},{"datetime": "1642805472", "val": "31.00"},{"datetime": "1642805482", "val": "31.43"},{"datetime": "1642805492", "val": "30.36"},{"datetime": "1642805502", "val": "30.16"},{"datetime": "1642805512", "val": "29.25"},{"datetime": "1642805522", "val": "28.47"},{"datetime": "1642805532", "val": "29.34"},{"datetime": "1642805542", "val": "29.69"},{"datetime": "1642805552", "val": "30.44"},{"datetime": "1642805562", "val": "31.71"},{"datetime": "1642805572", "val": "31.89"},{"datetime": "1642805582", "val": "31.33"},{"datetime": "1642805593", "val": "30.64"},{"datetime": "1642805603", "val": "29.80"},{"datetime": "1642805613", "val": "29.82"},{"datetime": "1642805623", "val": "30.53"},{"datetime": "1642805633", "val": "30.64"},{"datetime": "1642805643", "val": "30.42"},{"datetime": "1642805653", "val": "31.63"},{"datetime": "1642805663", "val": "30.77"},{"datetime": "1642805673", "val": "30.71"},{"datetime": "1642805683", "val": "30.31"},{"datetime": "1642805693", "val": "29.86"},{"datetime": "1642805703", "val": "29.76"},{"datetime": "1642805714", "val": "29.86"},{"datetime": "1642805724", "val": "30.17"},{"datetime": "1642805734", "val": "30.76"},{"datetime": "1642805744", "val": "31.06"},{"datetime": "1642805754", "val": "31.04"},{"datetime": "1642805764", "val": "29.92"},{"datetime": "1642805774", "val": "30.07"},{"datetime": "1642805784", "val": "30.77"},{"datetime": "1642805794", "val": "30.46"},{"datetime": "1642805805", "val": "30.44"},{"datetime": "1642805815", "val": "29.16"}]
  const getData = async() => {
    const {data}=await axiosClient.get(`/api/${id}`)
    if (data) {
      console.log(data.data)
      setSensors(data.data)
    }
  }

  const getUserInfo = async() => {
    try {
      const {data} = await axiosClient.get(`user/`)
      console.log(data)
      setUser(data.usuario);
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    getUserInfo();
  }, [ ]);
  useEffect(() => {
    getData()
  }, [user, id]);

  const CustomizedAxisTick = ({ x, y, payload }) => {
    const dateTip = moment.unix(payload.value)
      .format("l")
      
       return (
      <g transform={`translate(${x},${y})`}>
     <text x={23} y={0} dy={14} fontSize="0.90em" fontFamily="bold" textAnchor="end" fill="#fff">
       {dateTip}</text>
      </g>
     );
  };
  const CustomTooltip = ({ active, payload, label }) => {
    const dateTip = moment.unix(label)
      .format("lll")
    const formattedDate = dateTip
    if (payload === null) return
    if (active)
      return (
     <div className="custom-tooltip">
       <p className="label-tooltip">{`${formattedDate}`}</p>
       <p className="desc-tooltip">
      <span className="value-tooltip">Valor: {payload[0].value.toLocaleString()} {sensors.units}</span>
       </p>
     </div>
      );
    return null;
  };

  const xAxisTickFormatter = (timestamp_measured) => {
    return moment.unix(timestamp_measured)
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
  const [sensorDwn, setSensorDwn] = useState(sensors[0]?.type || 'CO2');
  const [dataDown, setDataDown] = useState(false);
  

  const exportData = async(e)=> {
    setDataDown(false)
    let res =[]
    
      if (downloadType==='between'){
        const minUnix = moment(minMaxDate.min + " 00:00", 'YYYY-MM-DD HH:mm').unix()
        const maxUnix = moment(minMaxDate.max  + " 23:59", 'YYYY-MM-DD HH:mm').unix()
        console.log({minUnix, maxUnix})
        const {data} = await axiosClient.get(`/api/${sensors[0].serial}/${sensorDwn}?start=${minUnix}&end=${maxUnix}`)
        res = data.data
        console.log(data)
        console.log(res)
     }else{
      console.log(sensors[0].serial)
      console.log(sensorDwn)
      const {data} = await axiosClient.get(`/api/${sensors[0].serial}/${sensorDwn?.toUpperCase() || sensors[0]?.type}`)
      console.log(data)
      res = data.data

     }
  
    console.log(res)
    
    
    if (res?.length !== 0){
      const fileName = downloadType==='between' ? `${sensors[0].serial}-${minMaxDate.min}_${downloadType}`  : `${sensors[0].serial}-${sensorDwn}_${downloadType}`;
      e.preventDefault()
      if (formatType==='json') {
        downloadFile({
          data: JSON.stringify(res),
          fileName: `${fileName}.json`,
          fileType: 'text/json',
        })
        
      }else{
        res = res.map(v=>{
          return {
            epoch:v.datetime,
            datetime:moment.unix(v.datetime).format("DD/MM/YYYY HH:mm:ss"),
            val: v.val 
          }
        })
        let csv = createCSV(res)
        downloadFile({
          data: csv,
          fileName: `${fileName}.csv`,
          fileType: 'text/csv',
      })
      }
    }else{
      setDataDown(true)
    }
  }
  
  
  const createCSV = (data)=>{
      console.log(data)
      const items = data
      const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
      const header = Object.keys(items[0])
      const csv = [
        header.join(','), // header row first
        ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
      ].join('\r\n')
      return csv
  }
  

  const handleChangeDownload = (e) => {
    setDownloadType(e.target.value)
  }
  const handleFormatDownload = (e) => {
    setFormatType(e.target.value)
  }
  const handleSensor = (e) => {
    console.log(e.target.value)
    setSensorDwn(e.target.value)
  }

  const handleDownload = (e)=>{
    exportData(e)
  }

  function hasNumber(myString) {
    return /\d/.test(myString);
  }

  const { openChangeNameModal } = useContext(ChangeNameContext);



  return <>
  <div className="update-data">
    <span>Ultimo registro del {moment.unix(sensors[0]?.data[sensors[0].data.length-1].datetime).format('DD-MM-YYYY HH:mm')}</span>
    <button onClick={getData} className="btn btn-primary" style={{background:" var(--titulo-form-input)", marginLeft: '1rem'}} >Actualiar datos</button>
  </div>
  {
    sensors && 
    sensors.map(sensor=>(
      <>
      <h1 className='sensor-name'>Sensor {sensor.metadata || sensor.serial + " " +sensor.type}</h1>
      
      <div className="sensor-data">
        <div className="sensor-units">
          <h4>Unidades</h4> <p>{sensor.units}</p>
        </div>
        <div className="sensor-type">
          <h4>Tipo de medición </h4> <p>{sensor.type}</p>
        </div>
      </div>
      <hr />
      <br />
      {
        sensor.data.length ?
        <ResponsiveContainer width="80%" height={400} >
          <LineChart width={800} height={400} data={sensor.data}>
            <Line type="monotone" dataKey="val" stroke="#8884d8" />
            <XAxis sclaeToFit="true" dataKey="datetime" tick={CustomizedAxisTick} />
            <YAxis type="number" domain={['auto', 'auto'] }  dataKey='val' />
            {/* <ReferenceLine y={10}  stroke="red" label={{position: 'top', value: `Max ${sensors.units}`, fill: 'red' }} /> */}
            <Legend />

            <Tooltip content={<CustomTooltip />} animationDuration={0}  />
            <Brush tickFormatter={xAxisTickFormatter} dataKey="datetime" startIndex={sensor.data? Math.round(sensor.data.length * 0.45) : 1  } />
          </LineChart>

        </ResponsiveContainer>
        :
        <p>Aun no hay datos de este sensor</p>
      }
      </>

    ))

  }
  <div className="map-location" style={{height:"300px",  width: "300px", marginBottom: "2rem"}} >
      <MapContainer style={{ height: "300px", width: "300px" }} center={sensors[0]?.latlong && hasNumber(sensors.latlong) ? sensors.latlong.split(',') : [22.152402, -100.979099]} zoom={13} scrollWheelZoom={true}  >
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

      <Marker zIndex={9999} position={sensors[0]?.latlong && hasNumber(sensors[0]?.latlong)? sensors[0]?.latlong.split(',') : [22.152402, -100.979099]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})} >

          <Popup>
              
            <h5>Tu sensor: </h5>  
            <p>{sensors.metadata}</p>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
    <div className="actions">
      <h3>Descargar datos</h3>
      <select name="sensor" id="sensor" value={sensorDwn} onChange={handleSensor} style={{padding: ".5rem 1rem"}}>
        {
          sensors.length &&
          sensors.map(sensor=> 
            <option value={sensor.type}>{sensor.type}</option>

          )
        }
      </select>
      <select name="formato" id="format" onChange={handleFormatDownload} style={{padding: ".5rem 1rem"}}>
        <option value="json">JSON</option>
        <option value="csv" selected defaultValue>CSV</option>
      </select>
      <select name="" id="" onChange={handleChangeDownload} style={{padding: ".5rem 1rem"}}>
        <option value="all" defaultValue>Todos los datos</option>
        <option value="between">Entre dos fechas</option>
      </select>
      {
        downloadType === 'between' &&
        <>
          <br />
          <label htmlFor="">
            Entre &nbsp;
            {
            (() => {
            const minInput = getMaxNMin(sensors.data).min
            const maxInput = getMaxNMin(sensors.data).max
            return <input value={minMaxDate.min || ''} min={minInput} max={maxInput}  type="date" onChange={(e)=>setMinMaxDate({...minMaxDate, min:e.target.value})} />
            })()
            }
   

          </label>
          <label htmlFor="">
          &nbsp; y &nbsp;
          {(() => {
            const minInput = getMaxNMin(sensors.data).min
            const maxInput = getMaxNMin(sensors.data).max
            return <input value={minMaxDate.max || '' } min={minInput} max={maxInput}  type="date" onChange={(e)=>setMinMaxDate({...minMaxDate, max:e.target.value})} />
            })()}
          </label>
        </>
      }
      
      <button onClick={handleDownload} className="btn btn-primary" style={{background:" var(--titulo-form-input)", borderRadius: 0, padding: "0.6rem 1rem"}} >
        Descargar
      </button>
    </div>
    <h4>
      {dataDown && "No hay datos que cumplan estos parametros"}
    </h4>

    
    <div className="actions-sensors" >
      <button className='btn btn-secundary' onClick={handleDelete}>Borrar monitor</button>
      <button className='btn btn-secundary' onClick={openChangeNameModal}>Editar nombre</button>

    </div>
 
  
      
  </>;
};
