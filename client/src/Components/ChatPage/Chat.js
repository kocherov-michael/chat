import { observer } from "mobx-react-lite"
import state from '../../WS/WS';


const getDoubleDigits = (number) => {
    const string = number.toString()
    return string.length === 2 ? string : 0 + string
}

const getHumanDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${getDoubleDigits(date.getDate())}.${getDoubleDigits(date.getMonth()+1)}.${date.getFullYear()} ${date.getHours()}:${getDoubleDigits(date.getMinutes())}:${getDoubleDigits(date.getSeconds())}`
}

const Chat = observer(() => {
    const activeContact = state.contacts.find(contact => contact.name === state.activeContact)
    const activeMessages = activeContact ? activeContact.messages : []
    
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'flex-end'
            }}
        >
            {activeMessages.map(message => {
                const isMyMessage = message.owner === state.login
                return (
                    <div 
                        key={message.time}
                        style={{
                            alignSelf: isMyMessage ? 'flex-end' : 'flex-start',
                            border: '1px solid grey',
                            margin: 4,
                            padding: 4,
                            borderRadius: isMyMessage ? '16px 16px 0 16px' : '16px 16px 16px 0',
                            backgroundColor: isMyMessage ? 'rgb(187, 255, 232)' :'white',
                            marginLeft: isMyMessage ? 32 : 0,
                            marginRight: isMyMessage ? 0 : 32,
                        }}
                    >
                        <div
                            style={{
                                textAlign: isMyMessage ? 'right' : 'left',
                            }}
                        >
                            <strong style={{paddingRight: 16}} >{activeContact.displayName}</strong>
                            {getHumanDate(message.time)}
                        </div>
                        <span style={{textAlign: 'left'}} >
                            {message.value}
                        </span>
                    </div>
                )
            })}
        </div>
        
    )
})

export default Chat