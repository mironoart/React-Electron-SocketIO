import React, { Component } from 'react'
import Logo from './components/Logo/'

import ElectronImg from './assets/electron.png'
import ReactImg from './assets/react.png'
import WebpackImg from './assets/webpack.png'

import socketIOClient from "socket.io-client";
const socket = socketIOClient("http://127.0.0.1:3000");



class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hashesPerSecond: 0,
            totalHashes: 0
        }
    }

    componentDidMount() {
        socket.on("connect", () => console.log('Client: connect'));
        socket.on("hashPerSecond", (hashPerSecond) => {
            this.setState({
                hashesPerSecond: hashPerSecond
            })
        })
        socket.on("totalHashes", (totalHashes) => {
            this.setState({
                totalHashes: totalHashes
            })
        })

    }

    startMining() {
        socket.emit('start mining')
    }
    stopMining() {
        socket.emit('stop mining')
    }

    render() {

        return (
            <div>
                <button onClick={this.startMining}>Start Mining</button>
                <button onClick={this.stopMining}>Stop Mining</button>
                <h4> Total Hashes: {this.state.totalHashes}</h4>
                <h4> Total Hashes: {this.state.hashesPerSecond}</h4>
            </div>
        )
    }
}


export default App