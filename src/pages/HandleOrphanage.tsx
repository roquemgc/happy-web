import React, { useEffect, useState, useRef, FormEvent, ChangeEvent } from "react";
import api from "../services/api";
import storageProvider from '../services/storageProvider'

import { Map, Marker, TileLayer,  } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet'
import { useHistory, useParams } from "react-router-dom";

import { FiPlus, FiXCircle, FiCheck } from "react-icons/fi";
import Sidebar from "../components/Sidebar";  
import ConfirmModal from '../components/ConfirmModal'
import mapIcon from '../utils/mapIcon'
import '../styles/pages/handle-orphanage.css';

interface OrphanageParams {
  id: string;
}

interface Props {
  acceptOrRefuse?: true;
}

export default function HandleOrphanage(props: Props) {
  const history = useHistory();
  const params = useParams<OrphanageParams>();
  const childRef = useRef(ConfirmModal);  

  const [position, setPosition] = useState({ latitude: -22.9, longitude: -47.2 });
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [submitType, setSubmitType] = useState('');

  useEffect(() => {
    // Se for passado um ID por parâmetro a tela será de edição de orfanato
    if(params.id) {
      api.get(`orphanage/${params.id}`).then(response => {
        const orphanage = response.data;
        // Insere os dados originais no formulário
        setPosition({
          latitude: orphanage.latitude,
          longitude: orphanage.longitude
        })
        setName(orphanage.name);
        setAbout(orphanage.about);
        setInstructions(orphanage.instructions);
        setOpeningHours(orphanage.opening_hours);
        setOpenOnWeekends(orphanage.open_on_weekends); 
      });
    }
  }, [params.id]);


  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;

    setPosition({
      latitude: lat,
      longitude: lng
    })
  }

  function handleSelectedImages(event: ChangeEvent<HTMLInputElement>) {
    if(!event.target.files) {
      return;
    }
    
    const selectedImages = Array.from(event.target.files);

    setImages(Array.from(selectedImages));

    const selectedImagesPreview = selectedImages.map(image => {
      return URL.createObjectURL(image);
    })

    setPreviewImages(selectedImagesPreview);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    let jwt: any;
    storageProvider.getUserJwt().then((value) => {
      jwt = value;
    });
    console.log(jwt);
    if(submitType === 'refused') {
      //Caso o usuário tenha recusado o orfanato
      await api.put('orphanage/accept-or-refuse', {
        headers: {
          Authorization: 'Bearer' + jwt
        },
        data: {
          id: params.id,
          acceptOrRefused: false
        }
      });



    } else { // Caso o usuario tenha editado/criado o orfanato
      
      const { latitude, longitude } = position;
      const data = new FormData();
  
      data.append('name', name);
      data.append('about', about);
      data.append('latitude', String(latitude));
      data.append('longitude', String(longitude));
      data.append('instructions', instructions);
      data.append('opening_hours', opening_hours);
      data.append('open_on_weekends', String(open_on_weekends));
      images.forEach(image => {
        data.append('images', image);
      })

      if(params.id) { // Caso orfanato editado
        await api.put(`orphanage/${params.id}`, data);
  
        alert('Edição realizada com sucesso!');
  
        history.push('/dashboard');
      } else { // Caso orfanato criado
        await api.post('orphanages', data);
  
        alert('Cadastro realizado com sucesso!');
  
        history.push('/app');
      }
    }
  }

  const handleOpen = () => {
    (childRef.current as any).handleOpen();
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar />
      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[position.latitude, position.longitude]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onClick={handleMapClick}
            >
              <TileLayer 
                url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAP_TOKEN}`}
              />
              { position.latitude !== 0 && (
                <Marker 
                  interactive={false} 
                  icon={mapIcon} 
                  position={[position.latitude,position.longitude]} 
                /> 
                )
              }
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input 
                id="name" 
                value={ name } 
                onChange={event => setName(event.target.value)} 
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea 
                id="about" 
                maxLength={300}
                value={ about } 
                onChange={event => setAbout(event.target.value)}  
                />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                { previewImages.map(image => {
                  return (<img key={image} src={image} alt={name} />)
                })}
                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={38} color="#15b6d6" />
                </label>
              </div>
              <input multiple onChange={handleSelectedImages} type="file" id="image[]"/>
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea 
                id="instructions" 
                value={ instructions } 
                onChange={event => setInstructions(event.target.value)}  
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input 
                id="opening_hours" 
                value={ opening_hours } 
                onChange={event => setOpeningHours(event.target.value)}  
                />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>
                <div className="button-select">
 
                  <button 
                    type="button" 
                    className={ open_on_weekends ? 'active' : '' }
                    onClick={() => setOpenOnWeekends(true)}
                  >
                    Sim
                  </button>
                  <button 
                    type="button"
                    className={ !open_on_weekends ? 'active' : '' }
                    onClick={() => setOpenOnWeekends(false)}
                  >
                    Não
                  </button>
                </div>
            </div>
          </fieldset>

          { props.acceptOrRefuse ? (
            <div className="edit-container">
              <button className="refuse-button" type="submit" onClick={() => setSubmitType('refused')}>
                <FiXCircle size={24} />
                Recusar
              </button>
              <button className="accept-button" type="submit">
               <FiCheck size={24} />
                Aceitar
              </button>
            </div>
          ): (
            <button className="confirm-button" type="submit" onClick={() => handleOpen()}>
              Confirmar
            </button>
          )}
        </form>
        <ConfirmModal 
          type="success"
          orphanage={name} 
          ref={childRef} 
        />
      </main>
    </div>
  );
}

