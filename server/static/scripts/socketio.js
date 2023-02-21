document.addEventListener('DOMContentLoaded', () => {
    var socket = io.connect('http://' + document.domain + ':' + location.port);

    socket.on('connect', () => {
        socket.emit('my event', {data: 'I\'m connected!'});
    });

    socket.on('message', data => {
        console.log(`I received a message! ${data['message']}`);
    });

    socket.on('response', data => {
        console.log(`I received a response! ${data['response']}`);
    });
});