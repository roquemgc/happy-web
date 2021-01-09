import React, { useEffect, useState } from 'react'
import storageProvider from '../services/storageProvider'

import Grid from '@material-ui/core/Grid';
import OrphanageCard from '../components/OrphanageCard';
import emptyOrphanageListIcon from '../images/emptyOrphanagesList.svg';
import '../styles/pages/dashboard.css';

import api from '../services/api'
import Sidebar from '../components/Sidebar';

interface Orphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  pending: boolean;
}

export default function PendingRegistration() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

  let jwt: any;
  storageProvider.getUserJwt().then((value) => {
    jwt = value;
  });
  useEffect(() => {
    api.get('orphanages/pending', {
      headers: {
        Authorization: 'Bearer ' +  jwt
      }
     }).then(response => {
      setOrphanages(response.data); 
    }); 

  }, [jwt]);

  return(
    <>
      <Sidebar dashboard />
      <div className="dashboard-item" id="dashboard" >
        <header>
          <h1>
            Cadastros pendentes
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
                      orphanage={orphanage} 
                    />
                  </Grid>
                ))}
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