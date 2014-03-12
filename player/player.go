package player

import (
	"code.google.com/p/go.net/websocket"
	"github.com/aybabtme/bomberman/logger"
	"github.com/aybabtme/bomberman/player"
	"net/http"
)

type WebsocketPlayer struct {
	state player.State
	l     *logger.Logger
	// Comms
	update  chan player.State
	outMove chan player.Move
}

func NewWebsocketPlayer(state player.State, mux *http.ServeMux, l *logger.Logger) player.Player {
	w := &WebsocketPlayer{
		l:       l,
		state:   state,
		update:  make(chan player.State, 10), // Buffer some responses, if network is slow
		outMove: make(chan player.Move, 1),   // Rate-limiting to 1 move per turn
	}

	pathPrefix := "/" + w.Name() + "/"

	mux.Handle(pathPrefix+"ws/move", websocket.Handler(w.moveHandler))
	mux.Handle(pathPrefix+"ws/update", websocket.Handler(w.updateHandler))
	return w
}

func (w *WebsocketPlayer) Name() string {
	return w.state.Name
}

func (w *WebsocketPlayer) Move() <-chan player.Move {
	return w.outMove
}

func (w *WebsocketPlayer) Update() chan<- player.State {
	return w.update
}

func (w *WebsocketPlayer) updateHandler(ws *websocket.Conn) {
	defer ws.Close()
	for u := range w.update {
		err := websocket.JSON.Send(ws, u)
		if err != nil {
			w.l.Errorf("[ws/%s] sending update to websocket conn, %v", w.Name(), err)
			return
		}
	}
}

func (w *WebsocketPlayer) moveHandler(ws *websocket.Conn) {
	w.l.Infof("[ws/%s] Waiting for connection on /ws/move", w.Name())
	defer ws.Close()

	var move string
	for {
		err := websocket.Message.Receive(ws, &move)
		if err != nil {
			w.l.Errorf("[ws/%s] receiving move from websocket conn, %v", w.Name(), err)
			w.l.Debugf("[ws/%s] content was %#v", w.Name(), move)
			return
		}

		var pMove player.Move
		switch move {
		case "up":
			pMove = player.Up
		case "down":
			pMove = player.Down
		case "left":
			pMove = player.Left
		case "right":
			pMove = player.Right
		case "bomb":
			pMove = player.PutBomb
		default:
			w.l.Debugf("[ws/%s] not a player action, '%#v', w.Name()", move)
			continue
		}

		w.l.Debugf("[ws/%s] Got move", w.Name())
		select {
		case w.outMove <- pMove:
			w.l.Debugf("[ws/%s] Sent move", w.Name())
		default:
			w.l.Debugf("[ws/%s] Dropped it =(", w.Name())
		}
	}
}
