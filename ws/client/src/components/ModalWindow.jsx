import React, {useState} from "react";
import {Button, Modal} from "react-bootstrap";
import {useParams} from "react-router-dom";


const ModalWindow = ({onClick}) => {
    const [userName, setUserName] = useState('')
    const [modal, setModal] = useState(true)
    const [inputLogin, setInputLogin] = useState(true)
    const params = useParams()
    const [hrefURL,setHrefURL] = useState(params.id)


    const login = () => {
        if (userName.length > 0) {
            onClick(userName)
            setModal(false)
        } else {
            setInputLogin(false)

        }
    }
    return(
        <div><Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={modal}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Привет, это рисовалка онлайн.
                    <br/>
                    <div className="pt-4">
                        Комната
                        <input value={hrefURL} onChange={(e)=>setHrefURL(e.target.value)} className="mx-2 fs-6" type="text"/>
                        <Button variant="primary" size="sm"><a style={{textDecoration: "none",color:"white"}} href={"/"+hrefURL}>Перейти в комнату</a></Button>
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Введите имя</h4>
                <input
                    type="text"
                    onChange={e => setUserName(e.target.value)}
                />
                <p>
                    Ваше имя будет отображаться другим пользователем в комнате. <br/>
                    Чтобы попасть в комнату к другу, скопируй URL и отправь другу,
                    либо вставь индификатор в поле.
                </p>
            </Modal.Body>
            <Modal.Footer>
                {
                    inputLogin === false
                        ? <div className="inputName">Необходимо ввести имя</div>
                        : ""
                }
                <Button onClick={()=>login()}>Войти</Button>
            </Modal.Footer>
        </Modal></div>
    );
}

export default ModalWindow