package bomberweb

import (
	"code.google.com/p/go.net/websocket"
	"github.com/aybabtme/bomberman/logger"
	"github.com/aybabtme/bomberman/player"
	"net/http"
)

type WebsocketPlayer struct {
	state player.State

	// Comms
	update  chan player.State
	inMove  <-chan player.Move
	outMove chan player.Move
}

func NewWebsocketPlayer(state player.State, mux *http.ServeMux, l *logger.Logger) player.Player {
	i := &WebsocketPlayer{
		state:   state,
		update:  make(chan player.State, 10), // Buffer some responses, if network is slow
		outMove: make(chan player.Move, 1),   // Rate-limiting to 1 move per turn
	}

	moveHandler := func(ws *websocket.Conn) {
		l.Infof("Waiting for connection on /ws/move")
		defer ws.Close()
		var move player.Move
		for {
			err := websocket.JSON.Receive(ws, &move)
			if err != nil {
				l.Errorf("receiving move from websocket conn, %v", err)
				return
			}
			l.Infof("Got move")
			select {
			case i.outMove <- move:
				l.Infof("Sent move")
			default:
				l.Infof("Dropped it =(")
			}
		}
	}

	updateHandler := func(ws *websocket.Conn) {
		defer ws.Close()
		for u := range i.update {
			err := websocket.JSON.Send(ws, u)
			if err != nil {
				l.Errorf("sending update to websocket conn, %v", err)
			}
			l.Infof("Send update")
		}
	}

	mux.Handle("/ws/move", websocket.Handler(moveHandler))
	mux.Handle("/ws/update", websocket.Handler(updateHandler))

	return i
}

func (i *WebsocketPlayer) Name() string {
	return i.state.Name
}

func (i *WebsocketPlayer) Move() <-chan player.Move {
	return i.outMove
}

func (i *WebsocketPlayer) Update() chan<- player.State {
	return i.update
}
