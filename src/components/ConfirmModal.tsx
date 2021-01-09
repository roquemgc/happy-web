import React, { forwardRef, useImperativeHandle } from 'react';
import { useHistory } from "react-router-dom";

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import deleteConfirmation from '../images/deleteConfirmation.svg'
import createSuccess from '../images/createSuccess.svg'
import '../styles/components/confirm-modal.css'

interface Props {
  type: string;
  handleDelete?: (id: number) => void;
  orphanage?: any;
}

const ConfirmModal = forwardRef((props: Props, ref: any) => {
  const history = useHistory();

  const [open, setOpen] = React.useState(false);

  useImperativeHandle(
    ref,
    () => ({
      handleOpen() {
        setOpen(true);
      }
    })
  )

  function handleClose() {
    if(props.type === 'success') {
      history.goBack();
    }
    setOpen(false);
  };

  function handleClickDelete() {
    (props as any).handleDelete(props.orphanage.id)
    setOpen(false);
  }

  return (
    <>
      <style>
        { props.type === 'delete' ? (`
          .modal .paper {
            background-color: #FF669D;
          }
          .modal .paper .content-wrapper button.go-back{
            background-color: #D20769;
          }
          .modal .paper .content-wrapper button.go-back:hover {
            background-color: #BB055D;
          }
        `): (`
          .modal .paper {
            background-color: #37C77F;
          }
          .modal .paper .content-wrapper button.go-back{
            background-color: #31B272;
          }
          .modal .paper .content-wrapper button.go-back:hover {
            background-color: #3BD689;
          }  
        `)}
      </style>
      { props.orphanage && (
        <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className="modal"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>

          { props.type === 'delete' ? (
            <div className='paper'>
              <div className="content-wrapper">
                <h2 id="transition-modal-title">Excluir! </h2>
                <p id="transition-modal-description">Você tem certeza que quer excluir</p>
                <p>{ props.orphanage.name }?</p>
                <div className="button-wrapper">
                  <button className='go-back' type="button" onClick={handleClose}>
                    Voltar para a lista
                  </button>
                  <button className="delete-confirmation" type="button" onClick={handleClickDelete}>
                    Excluir
                  </button>
                </div>
              </div>
              <img src={deleteConfirmation} alt="confirmation" />
            </div>
          ): (
            <div className='paper'>
              <div className="content-wrapper">
                <h2 id="transition-modal-title">Ebaaa!</h2>
                <p id="transition-modal-description">
                  O cadastro do {props.orphanage} deu certo e foi enviado 
                  ao administrador para ser aprovado.
                </p>
                <p>Agora é só esperar :]</p>
                <div className="button-wrapper">
                  <button className='go-back' type="button" onClick={handleClose}>
                    Voltar para o mapa
                  </button>
                </div>
              </div>
              <img src={createSuccess} alt="success" />
            </div>
          )}
        </Fade>
      </Modal>
      ) }
    </>
  );
});
export default ConfirmModal;
