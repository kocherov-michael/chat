import { Link } from 'react-router-dom';
import { observer } from "mobx-react-lite"
import state from '../../WS/WS';
import Chat from './Chat';


const ChatPage = observer(() => (
    <>
        <Link to="/">{'<- Назад'}</Link>
        <h3>ChatPage</h3>
        <div>
            ChatPage
        </div>
        <form>
            <label style={{padding: 8}}>
                Имя нового контакта
                <input 
                    style={{marginLeft: 16}}
                    type={'text'} 
                    name={'contact'} 
                    value={state.contactName} 
                    onChange={(e) => {state.setContactName(e.target.value)}} 
                />
            </label>
            <button onClick={(e) => {state.addContact(e)}} >Добавить контакт в список</button>
        </form>
        <div className='chatPageWrapper'>
            <div className='contacts' >
                <h3>Контакты</h3>
                {state.contacts.map((contact) => {
                    console.log('contact.name',contact.name)
                    console.log('state.activeContact',state.activeContact)
                    return (
                    <div 
                        key={contact.name}
                        onClick={() => {state.setActiveContact(contact.name)}}
                        style={{
                            border: contact.name === state.activeContact ? '1px solid grey' : '',
                            borderRadius: 4,
                            padding: 4,
                            display: 'flex',
                            justifyContent: 'space-between',
                            cursor: 'pointer'
                        }}
                    >
                        {contact.displayName}
                        <span
                            style={{
                                borderRadius: 4,
                                backgroundColor: 'red',
                                width: 24,
                                height: 24,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer'
                            }}
                            onClick={(e) => {state.removeContact(e, contact.name)}}
                        >
                            x
                        </span>
                    </div>
                )})}
            </div>
            <div className='chat'>
                <h3>Чат</h3>
                <Chat />
                {state.activeContact ? <form
                    style={{
                        backgroundColor: 'white',

                    }}
                >
                    <label style={{padding: 0}}>
                        <input 
                            style={{
                                marginLeft: 4,
                                padding: 16,

                            }}
                            type={'text'} 
                            name={'contact'} 
                            value={state.typingMessage} 
                            onChange={(e) => {state.setTypingMessage(e.target.value)}} 
                            placeholder='Введите сообщение'
                        />
                    </label>
                    <button onClick={(e) => {state.sendMessage(e)}} >Отправить</button>
                </form>
                : null}
            </div>
        </div>
    </>
));

export default ChatPage