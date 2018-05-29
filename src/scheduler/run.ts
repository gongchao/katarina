import runWorker from './worker';
import {fork} from 'child_process';
import {cpus} from 'os';

/**
 * exec runWorker
 */
runWorker('gongchao')
    .then(() => {
        console.log(cpus().length);
        for (let i = 0; i < cpus().length; i++) {
            const child = fork(__dirname + '/scheduler.js');

            child.on('message', data => {
                console.log(data);
            });

            child.send({ type: 'start', data: i });
        }
    });
