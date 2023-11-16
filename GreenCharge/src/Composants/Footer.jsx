import '../style/Footer.css'
import { Link } from "react-router-dom";
import Modal from 'react-modal';
import React, { useEffect, useState } from 'react';
const Footer = () => {
    const [mentionsLegalesModalIsOpen, setMentionsLegalesModalIsOpen] = useState(false);
    const [contactModalIsOpen, setContactModalIsOpen] = useState(false);
    const [adresseModalIsOpen, setAdresseModalIsOpen] = useState(false);
    const [telephoneModalIsOpen, setTelephoneModalIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            height: '300px',
            zIndex: 1
        }
    };

    
const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    switch(name) {
        case "email":
            setEmail(value);
            break;
        case "subject":
            setSubject(value);
            break;
        case "message":
            setMessage(value);
            break;
        default:
            break;
    }
  };
    return (
        <footer className="row text-center d-flex justify-content-around bg-success mt-5 ">
            <hr />
            <div className="col-2">
                <div className='d-inline-block '>
                    <button className='btn btn-lg my-2 mx-2 bg-white' onClick={() => setMentionsLegalesModalIsOpen(true)}>Mentions legale</button>
                    <button className='btn btn-lg my-2 mx-2 bg-white' onClick={() => setContactModalIsOpen(true)}>Contact</button>
                </div>
            </div>
            <div className="col-1 ">
                <div className='d-inline-block '>
                    <button className='btn btn-lg my-2 bg-white' onClick={() => setTelephoneModalIsOpen(true)} >Téléphone</button>
                    <button className='btn btn-lg my-2 bg-white' onClick={() => setAdresseModalIsOpen(true)}>Adresse</button>
                </div>
            </div>
            <div className="col-2 ">
                <div className='d-inline-block '>
                    <button className='btn btn-lg my-2 mx-2 bg-white'><Link to="/politique_de_confidentialiter">Confidentialité</Link></button>
                    <button className='btn btn-lg my-2 mx-2 bg-white'><Link to="/Apropos">A propos</Link></button>
                </div>
            </div>
            <Modal style={customStyles} isOpen={adresseModalIsOpen} onRequestClose={() => setAdresseModalIsOpen(false)}>
                <h2>Adresse</h2>
                <p>1 Sawamatsukura, Nihommatsu, Fukushima 964-0088, Japon</p>
                <button className='btn btn-info' onClick={() => setAdresseModalIsOpen(false)}>Fermer</button>
            </Modal>

            <Modal style={customStyles} isOpen={telephoneModalIsOpen} onRequestClose={() => setTelephoneModalIsOpen(false)}>
                <h2>Téléphone</h2>
                <p>Ta craquer toi taura pas mon 06</p>
                <button className='btn btn-info' onClick={() => setTelephoneModalIsOpen(false)}>Fermer</button>
            </Modal>

            <Modal isOpen={contactModalIsOpen} onRequestClose={() => setContactModalIsOpen(false)} style={customStyles}>
                <h2>Contact</h2>
                <input
                    type="email"
                    className="form-control mt-2"
                    name="email"
                    value={email}
                    onChange={handleInputChange}
                    placeholder="Votre email"
                />
                <input
                    type="text"
                    className="form-control mt-2"
                    name="subject"
                    value={subject}
                    onChange={handleInputChange}
                    placeholder="Sujet"
                />
                <textarea
                    type="text-area"
                    className="form-control mt-2"
                    name="message"
                    value={message}
                    onChange={handleInputChange}
                    placeholder="Votre message"
                />
                <button className='btn btn-info mt-2' onClick={() => setContactModalIsOpen(false)}>Fermer</button>
            </Modal>

            <Modal style={customStyles} isOpen={mentionsLegalesModalIsOpen} onRequestClose={() => setMentionsLegalesModalIsOpen(false)}>
                <h2>Mention legale</h2>
                    <p>
                        pas encore declarer 
                    </p>
                <button className='btn btn-info' onClick={() => setMentionsLegalesModalIsOpen(false)}>Fermer</button>
            </Modal>
        </footer>
    );
}

export default Footer;