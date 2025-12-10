import { URL_BASE } from "../utils/endpoints";

class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.connected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000;
        this.subscriptions = new Map();
        this.messageHandlers = new Map();
    }

    /**
     * Conectar al servidor WebSocket
     * @param {string} url - URL del endpoint WebSocket
     * @returns {Promise<void>}
     */
    connect(url = `${URL_BASE}/ws-contenido`) {
        return new Promise((resolve, reject) => {
            try {
                // Crear socket con SockJS
                const socket = new SockJS(url);

                // Crear cliente STOMP
                this.stompClient = Stomp.over(socket);

                // Configurar para producción (desactivar logs en consola)
                this.stompClient.debug = (msg) => {
                    // Comentar en desarrollo para ver logs
                    console.log('STOMP:', msg);
                };

                // Conectar
                this.stompClient.connect(
                    {}, // Headers vacíos (puedes agregar autenticación aquí)
                    (frame) => {
                        console.log('WebSocket conectado:', frame);
                        this.connected = true;
                        this.reconnectAttempts = 0;

                        // Resubscribirse a los topics previos si hay reconexión
                        this.resubscribeAll();

                        resolve();
                    },
                    (error) => {
                        console.error('Error de conexión WebSocket:', error);
                        this.connected = false;

                        // Intentar reconexión
                        this.attemptReconnect(url);

                        reject(error);
                    }
                );

                // Manejar desconexiones
                socket.onclose = () => {
                    console.warn('WebSocket desconectado');
                    this.connected = false;
                    this.attemptReconnect(url);
                };

            } catch (error) {
                console.error('Error al inicializar WebSocket:', error);
                reject(error);
            }
        });
    }

    /**
     * Intentar reconexión automática
     * @param {string} url - URL del endpoint
     */
    attemptReconnect(url) {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Máximo de intentos de reconexión alcanzado');
            return;
        }

        this.reconnectAttempts++;
        console.log(`Intentando reconexión (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

        setTimeout(() => {
            this.connect(url).catch(() => {
                // Error manejado en connect()
            });
        }, this.reconnectDelay);
    }

    /**
     * Resubscribirse a todos los topics después de reconexión
     */
    resubscribeAll() {
        this.subscriptions.forEach((subscription, topic) => {
            const handler = this.messageHandlers.get(topic);
            if (handler) {
                this.subscribe(topic, handler);
            }
        });
    }

    /**
     * Suscribirse a un topic
     * @param {string} topic - Topic a suscribirse (ej: '/topic/publicaciones/1/likes')
     * @param {Function} callback - Función que maneja los mensajes recibidos
     * @returns {Object|null} Subscription object
     */
    subscribe(topic, callback) {
        if (!this.connected || !this.stompClient) {
            console.warn('No conectado. Esperando conexión para suscribirse a:', topic);
            // Guardar para suscribirse después
            this.messageHandlers.set(topic, callback);
            return null;
        }

        try {
            // Desuscribirse si ya existe
            if (this.subscriptions.has(topic)) {
                this.unsubscribe(topic);
            }

            // Suscribirse al topic
            const subscription = this.stompClient.subscribe(topic, (message) => {
                try {
                    const data = JSON.parse(message.body);
                    callback(data);
                } catch (error) {
                    console.error('Error al parsear mensaje WebSocket:', error);
                }
            });

            this.subscriptions.set(topic, subscription);
            this.messageHandlers.set(topic, callback);

            console.log('Suscrito a:', topic);
            return subscription;

        } catch (error) {
            console.error('Error al suscribirse al topic:', topic, error);
            return null;
        }
    }

    /**
     * Desuscribirse de un topic
     * @param {string} topic - Topic del cual desuscribirse
     */
    unsubscribe(topic) {
        const subscription = this.subscriptions.get(topic);
        if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(topic);
            this.messageHandlers.delete(topic);
            console.log('Desuscrito de:', topic);
        }
    }

    /**
     * Enviar mensaje a través del WebSocket
     * @param {string} destination - Destino del mensaje (ej: '/app/likes')
     * @param {Object} body - Cuerpo del mensaje
     */
    send(destination, body) {
        if (!this.connected || !this.stompClient) {
            console.error('No se puede enviar mensaje: WebSocket no conectado');
            return;
        }

        try {
            this.stompClient.send(destination, {}, JSON.stringify(body));
            console.log('Mensaje enviado a:', destination);
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
        }
    }

    /**
     * Desconectar del WebSocket
     */
    disconnect() {
        if (this.stompClient && this.connected) {
            // Desuscribirse de todos los topics
            this.subscriptions.forEach((subscription, topic) => {
                this.unsubscribe(topic);
            });

            this.stompClient.disconnect(() => {
                console.log('WebSocket desconectado correctamente');
            });

            this.connected = false;
            this.stompClient = null;
        }
    }

    /**
     * Verificar si está conectado
     * @returns {boolean}
     */
    isConnected() {
        return this.connected;
    }

    /**
     * Obtener estado de la conexión
     * @returns {Object}
     */
    getStatus() {
        return {
            connected: this.connected,
            reconnectAttempts: this.reconnectAttempts,
            activeSubscriptions: this.subscriptions.size
        };
    }
}

// Exportar instancia única (singleton)
export const websocketService = new WebSocketService();