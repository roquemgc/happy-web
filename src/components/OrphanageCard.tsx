import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { Map, Marker, TileLayer,  } from 'react-leaflet';
import Paper from '@material-ui/core/Paper'
import Fade from '@material-ui/core/Fade';

import { FiTrash, FiEdit3, FiArrowRight } from 'react-icons/fi'
import mapIcon from '../utils/mapIcon'

import '../styles/components/orphanage-card.css';

interface Orphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

interface Props {
  dashboard?: boolean;
  handleOpenConfirmModal?: (item: any) => void;  
  handleDelete?: (id: number) => void;
  orphanage: Orphanage;
}

export default function OrphanageCard(props: Props) {
  const [checked, setChecked] = React.useState(false);

  useEffect(() => {
    setChecked((prev) => !prev);
  }, []);

  function handleClickDelete() {
    (props as any).handleOpenConfirmModal(props.orphanage)
  }

  return (
    <Fade in={checked} >
      <Paper className="orphanage-card">
        <Map 
          center={[props.orphanage.latitude, props.orphanage.longitude]} 
          style={{ width: '100%', height: 200 }}
          zoom={15}
          onClick={()=>{}}
        >
          <TileLayer 
            url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAP_TOKEN}`}
          />
          <Marker 
            interactive={false} 
            icon={mapIcon} 
            position={[props.orphanage.latitude, props.orphanage.longitude]}
          /> 
        </Map>
        <div className="card-menu">
          <h2>{props.orphanage.name}</h2>
          { props.dashboard ? (
            <div className="actions-container"> 
              <Link to={`/orphanage/${props.orphanage.id}/edit`}>
                <FiEdit3 size={20} color="#15C3D6" />
              </Link>
              <button type="button" onClick={handleClickDelete} >
                <FiTrash size={20} color="#15C3D6" />
              </button>
            </div>
          ) : (
            <div className="actions-container">
              <Link to={`/orphanage/${props.orphanage.id}/accept-or-refuse`}>
                <FiArrowRight size={20} color="#15C3D6" />
              </Link> 
            </div>
          )}
        </div>
      </Paper>
    </Fade> 
  );
}
