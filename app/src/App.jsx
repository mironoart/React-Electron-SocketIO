import React, { Component } from 'react'
import Logo from './components/Logo/'

import ElectronImg from './assets/electron.png'
import ReactImg from './assets/react.png'
import WebpackImg from './assets/webpack.png'

import socketIOClient from "socket.io-client";
const socket = socketIOClient("http://127.0.0.1:3000");

const logos = [
    ElectronImg,
    ReactImg,
    WebpackImg
]

export default class App extends Component {

    componentDidMount() {
        socket.on("connect", () => console.log('Client: connect'));

    }
    sayHi() {
        console.log('Hi')
        socket.emit('chat message', 'Hello From Client')
    }
    render() {

        const logosRender = logos.map((logo, index) => {
            return <Logo key={index} src={logo} />
        })
        socket.on('chat message', function (msg) {
            console.log(msg)
        });

        return (
            <div>
                {logosRender}
                <div className="hello">
                    <button onClick={this.sayHi}>Hello React!</button>
                </div>
            </div>
        )
    }
}
