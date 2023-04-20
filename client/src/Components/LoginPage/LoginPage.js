import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from "mobx-react-lite"
import state from '../../WS/WS'

const LoginPage = observer(() => {

    return (
    <div style={{
        padding: 24
    }}>
        <Link to="/">{'<- Назад'}</Link>
        <h3>LoginPage</h3>
        <div>
            LoginPage
        </div>

        {state.auth 
        ? 
            <>
                <div>Вы авторизованы как <strong>{state.login}</strong></div>
                <button onClick={(e) => {state.resetAuth(e)}} >Log out</button>
            </>
        :
            <form style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
            }} >
                <label style={{padding: 8}}>
                    Логин
                    <input 
                        style={{marginLeft: 16}}
                        type={'text'} 
                        name={'login'} 
                        value={state.login} 
                        onChange={(e) => {state.setLogin(e.target.value)}} 
                    />
                </label>
                <label style={{padding: 8}}>
                    Пароль
                    <input 
                        style={{marginLeft: 16}}
                        type={'password'} 
                        name={'password'} 
                        value={state.password} 
                        onChange={(e) => {state.setPassword(e.target.value)}} 
                    />
                </label>
                <button 
                    onClick={(e) => {
                        e.preventDefault()
                        state.sendAuth()
                    }} 
                >
                    Log in
                </button>
            </form>
        }
        
    </div>
)});

export default LoginPage
