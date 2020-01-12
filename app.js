#!/usr/bin/env node

'use strict';

const net = require('net');
const Socket = net.Socket;
const configs = require(`${__dirname}/config.json`);
const hosts = require(`${__dirname}/hosts.json`);
const timestamp = require(`${__dirname}/lib/timestamp.js`);
const colors = require(`${__dirname}/lib/colors.js`);
const table = require(`${__dirname}/lib/table.js`);

const firstExeTime = configs.start_requests_time;
const repeatTime = configs.request_period;

// + available
// - unavailable
// ~ checking
const states = ['+', '-', '~'];

let hostsArray = [];



const latencyComparison = (previousLatency, currentLatency) => {
  if (previousLatency == undefined || currentLatency == undefined) {
    return `${colors.blue('--')}`;
  } else if (previousLatency > currentLatency) {
    let percent = (1 - (currentLatency / previousLatency)) * 100;

    return `${colors.green('<-')} ${colors.green(Math.round(percent) + '%')}`;
  } else if (previousLatency < currentLatency) {
    let percent = ((currentLatency / previousLatency) - 1) * 100;

    return percent === Infinity ? `${colors.blue('--')} ${colors.blue('0%')}` : `${colors.red('->')} ${colors.red(Math.round(percent) + '%')}`;
  } else if (previousLatency == currentLatency) {
    return `${colors.blue('--')} ${colors.blue('0%')}`;
  }
}



class Host {
  constructor(id, name, address, port, state) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.port = port;
    this.state = state;
    this.previousLatency = 0;
    this.currentLatency = 0;
    this.latencyState = '';
    this.timestamp = '';
  }

  async checkHost() {
    const socket = new Socket();
    const timeout = configs.request_timeout;
    const latencyStart = Date.now();
    this.previousLatency = this.currentLatency;

    socket.setTimeout(timeout);

    socket.on('connect', async () => {
      this.state = await colors.green(states[0]);
      this.timestamp = await colors.purple(timestamp.getTimestamp());
      this.currentLatency = Date.now() - latencyStart;
      this.latencyState = `${this.currentLatency} ms ${latencyComparison(this.previousLatency, this.currentLatency)}`;

      await socket.destroy();
    });

    socket.on('error', async (e) => {
      this.state = await colors.red(states[1]);
      this.timestamp = await colors.purple(timestamp.getTimestamp());
      this.latencyState = `- ms ${colors.blue('--')}`;

      await socket.destroy();
    });

    socket.on('timeout', async (e) => {
      this.state = await colors.blue(states[2]);
      this.timestamp = await colors.purple(timestamp.getTimestamp());
      this.latencyState = `- ms ${colors.blue('--')}`;

      await socket.destroy();
    });

    await socket.connect(this.port, this.address);

    return this;
  }
}



const tableRender = () => {
  let tableData = [
    [colors.yellow('#'), colors.yellow('name'), colors.yellow('address'), colors.yellow('port'), colors.yellow('state'), colors.yellow('latency'), colors.yellow('timestamp')],
    null
  ];

  hostsArray.forEach((host) => {
    tableData.push([host.id, host.name, host.address, host.port, host.state, host.latencyState, host.timestamp]);
  });

  console.log('\x1Bc');
  console.log('Enclave X-01 Server Nodes Ver. 2.0.0');
  console.log('(c) Autumn 2019 S.A. Inc.\n');
  console.log(table.table(tableData));

  tableData = [];
}


(() => {
  process.title = 'Node TCP Dashboard';

  let hostID = 1;

  hosts.forEach((host) => {
    hostsArray.push(new Host(colors.cyan(hostID), host.name, host.address, host.port, colors.blue(states[2])));
    hostID++;
  });

  setTimeout(function exe() {
    hostsArray.forEach((host) => {
      host.checkHost();
    });

    tableRender();

    setTimeout(exe, repeatTime); // Next Calls.
  }, firstExeTime); // First Call.
})();
