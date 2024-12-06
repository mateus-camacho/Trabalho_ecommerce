export function useWebsocket() {
  let url = null;

  try {
    url = process.env.API_URL;
  } catch (error) {
    console.log(error);
  }

  const websocket = new WebSocket(url ?? "wss://nosql-trab.vercel.app");

  websocket.onopen = () => {
    console.log("Conexão aberta");
  };

  websocket.onclose = () => {
    console.log("Conexão fechada");

    setTimeout(() => {
      useWebsocket();
    }, 5000);
  };

  websocket.onerror = (error) => {
    console.log("Erro na conexão", error);
  };

  return websocket;
}
