import React, { useEffect, useState, useRef } from 'react';

import Grid from '@material-ui/core/Grid';
import OrphanageCard from '../components/OrphanageCard';
import ConfirmModal from '../components/ConfirmModal';
import emptyOrphanageListIcon from '../images/emptyOrphanagesList.svg';
import '../styles/pages/dashboard.css';

import api from '../services/api';
import Sidebar from '../components/Sidebar';

interface Orphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export default function Dashboard() {
  const [orphanage, setOrphanage] = useState(null);
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

  const childRef = useRef(ConfirmModal);  

  useEffect(() => {
    api.get('orphanages').then(response => {
      setOrphanages(response.data); 
    }); 
  }, []);

  const handleOpenConfirmModal = (item: any) => {
    setOrphanage(item);
    (childRef.current as any).handleOpen();
  }

  function handleDelete(id: number) {
    api.delete(`orphange/${id}`).then(response => {
      console.log(response);
    })
  }

  return(
    <>
      <Sidebar dashboard />
      <div className="dashboard-item" id="dashboard" >
        <header>
          <h1>
            Orfanatos cadastrados
          </h1>
          <p>
            {orphanages.length} orfanatos encontrados
          </p>
        </header>
        <main>
          <div className="orphanages-list">
            { orphanages.length ? (
              //Caso encontre orfanatos
              <Grid container spacing={5}>
                {orphanages.map((orphanage) => (
                  <Grid key={orphanage.id} item xs={6} >
                    <OrphanageCard 
                      dashboard
                      handleOpenConfirmModal={handleOpenConfirmModal}
                      handleDelete={handleDelete} 
                      orphanage={orphanage} 
                    />
                  </Grid>
                ))}
                <ConfirmModal 
                  type="delete" 
                  handleDelete={handleDelete} 
                  orphanage={orphanage}
                  ref={childRef} 
                />
              </Grid>
            ) : (
              //Caso não encontre orfanatos
              <div className="empty-list">
                <img src={emptyOrphanageListIcon} alt="Não há orfanatos" />
                <p>Não há orfanatos cadastrados</p>
              </div> 

            )}
          </div>
        </main>
      </div>
    </>
  );
}