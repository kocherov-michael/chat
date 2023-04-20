import { makeAutoObservable } from "mobx"

console.log('location:', window.location)
const wsProptocol = window.location.protocol === 'http:' ? 'ws:' : 'wss:'
const myWs = new WebSocket(`${wsProptocol}//${window.location.hostname}:9000`);


function wsSendAuth(auth) {
    myWs.send(JSON.stringify({action: "auth", ...auth}));
}

function wsSendMsg(message, contactName) {
    myWs.send(JSON.stringify({action: 'msg', to: contactName, message }));
  }

let storageCredentials = {}
let contactsList = []
let login = ''
let password = ''
try {
    storageCredentials = JSON.parse(localStorage.getItem('auth')) || {}
    login = storageCredentials.login || ''
    password = storageCredentials.password ? atob(storageCredentials.password) : ''
} catch (e) {
    console.error('чтение из localStorage', e)
}
try {
    contactsList = JSON.parse(localStorage.getItem('contacts')) || []
} catch (e) {
    console.error('чтение из localStorage', e)
}

class State {
    login = login
    password = password
    auth = false
    contacts = contactsList || []
    activeContact = ''
    contactName = ''
    typingMessage = ''


    constructor() {
        makeAutoObservable(this)
    }

    setLogin(value) {
        this.login = value
    }
    setPassword(value) {
        this.password = value
    }
    setContactName(value) {
        this.contactName = value
    }
    setActiveContact(value) {
        this.activeContact = value
    }
    setTypingMessage(value) {
        this.typingMessage = value
    }
    setUserAuth(value) {
        this.auth = value
    }
    addMessage(contactName, message) {
        const contact = this.contacts.find(contact => contact.name === contactName)
        contact.messages.push(message)
        localStorage.setItem('contacts', JSON.stringify(this.contacts))
    }
    addContact(e) {
        e.preventDefault()
        if (this.contactName) {
            if (this.contacts.find(contact => contact.name === this.contactName)) {
                alert('Такой контакт уже существует')
                return
            }
            const newContact = {
                name: this.contactName,
                displayName: this.contactName,
                messages: []
            }
            this.contacts.push(newContact)
            localStorage.setItem('contacts', JSON.stringify(this.contacts))
            this.contactName = ''
        }
    }
    removeContact(e, contactNameForRemove) {
        e.stopPropagation()
        e.preventDefault()
        if (contactNameForRemove) {
            const removeIndex = this.contacts.findIndex(contact => contact.name === contactNameForRemove)
            if (removeIndex !== -1) {
                this.contacts.splice(removeIndex, 1)
            }
            
            localStorage.setItem('contacts', JSON.stringify(this.contacts))
        }
    }

    async sendAuth() {
        
        if (this.login && this.password) {
            console.log('this.login',this.login,' this.password',this.password)
            const auth = {
                login: this.login,
                password: btoa(this.password)
            }
            localStorage.setItem('auth', JSON.stringify(auth))
            wsSendAuth(auth)
        }
    }

    async resetAuth(e) {
        e.preventDefault()
        localStorage.removeItem('auth')
        this.setLogin('')
        this.setPassword('')
        this.setUserAuth(false)
        wsSendAuth('')
    }

    async sendMessage(e) {
        e.preventDefault()
        if (this.login && this.password) {
            const message = {
                value: this.typingMessage,
                owner: this.login,
                time: Date.now()
            }
            this.addMessage(this.activeContact, message)
            this.setTypingMessage('')
            wsSendMsg(message, this.activeContact)
        }
    }
}

myWs.onopen = function () {
    console.log('подключился');
    state.sendAuth()
}

myWs.onmessage = function (message) {
    console.log('пришло сообщение:', message.data);
    try {
  
      const data = JSON.parse(message.data)
      if (data.type === 'alert') {
        alert(data.message)
      }
      else if (data.type === 'msg') {
        state.addMessage(data.message.owner, data.message)
      }
      else if (data.type === 'auth') {
        if (data.status) {
            state.setUserAuth(data.status)
        }
      }
    } catch (e) {
      console.error(e)
    }
  };

const state = new State()

export default state