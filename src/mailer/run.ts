import {fork} from 'child_process';
import {cpus} from 'os';

for (let i = 0; i < cpus().length; i++) {
    console.log(cpus().length);

    const child = fork(__dirname + '/sendEmail.js');

    child.on('message', data => {
        console.log(data);
    });

    child.send({ type: 'start', data: i });
}
