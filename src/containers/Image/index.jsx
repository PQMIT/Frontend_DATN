// eslint-disable-next-line
import { Modal } from '@material-ui/core';
import React, { useState } from 'react';
import './styles.css';
import { IKImage, IKVideo, IKContext, IKUpload } from 'imagekitio-react';
const ModalImage = ({ imageUrl }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  imageUrl = 'https://i.imgur.com/v63TJ4j.png';

  return (
    <div>
      <button alt="Modal Image" onClick={openModal}>
        Image
      </button>

      {isOpen && (
        <Modal
          open={isOpen}
          onClose={closeModal}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div className="image-frame">
            <img
              className="cover-image"
              src={imageUrl}
              //   style={{ width: '50%', height: '50%' }}
              alt="Image"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ModalImage;
