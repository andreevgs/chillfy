import {
    MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('change card')
    changeCard(@MessageBody() data: any) {
        console.log(data);
        this.server.emit('change card', {
            content: data.content,
            to: data.to,
        });
    }

    afterInit(server: Server) {
        console.log(server);
    }

    handleDisconnect(client: Socket) {
        console.log(`Disconnected: ${client.id}`);
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log(`Connected ${client.id}`);
    }
}