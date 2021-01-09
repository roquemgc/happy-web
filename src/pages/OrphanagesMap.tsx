import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiPlus } from 'react-icons/fi'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'


import mapMarkerImg from '../images/map-marker.svg'
import mapIcon from '../utils/mapIcon'

import '../styles/pages/orphanage-map.css'
import api from '../services/api' 

interface Orphanages {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
}

function OrphanagesMap() {
    const [orphanages, setOrphanages] = useState<Orphanages[]>([]);

    useEffect(() => {
        api.get('orphanages').then(response => {
            setOrphanages(response.data); 
        }); 
    }, []);
    
    return (
        <div id="page-map">
            <aside>
                <header>
                    <Link to="/">
                        <img src={mapMarkerImg} alt="happy"/>
                    </Link>

                    <h2>Escolha um orfanato no mapa</h2>
                    <p>Muitas crianças estão esperando sua visita :)</p>
                </header>

                <footer>
                    <strong>Hortolândia</strong>
                    <span>São Paulo</span>
                </footer>
            </aside>

            <Map 
                center={[-22.9031684,-47.1849677]} 
                zoom={15} 
                style={{ width: '100%', height: '100%'}} 
            >
                <TileLayer 
                    url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAP_TOKEN}`} 
                />    
                
                {orphanages.map(orphanage => {
                    return (
                    <Marker 
                        icon={mapIcon}
                        position={[orphanage.latitude, orphanage.longitude]}
                        key={orphanage.id}
                    >
                        <Popup 
                            closeButton={false} 
                            minWidth={240} 
                            maxWidth={240}
                            className="map-popup"
                        >
                            {orphanage.name}
                            <Link to={`/orphanages/${orphanage.id}`}>
                                <FiArrowRight size={20} color="#FFF" />
                            </Link>    
                        </Popup>
                    </Marker>
                    )
                })}
            </Map>

            <Link to="/orphanages/create" className="create-orphanage">
                <FiPlus size={32} color="#FFF" />
            </Link>

        </div>
    );
}


export default OrphanagesMap;