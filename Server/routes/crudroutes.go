package routes

import (
	"net/http"
	//"strings"
	"server/handlers"
)

func InitRouter() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request){
		path := r.URL.Path
		method := r.Method

		if path == "/transactions" {
			switch method {
			case http.MethodGet:
				handlers.GetTransactions(w,r)
			case http.MethodPost:
				handlers.CreateTransaction(w,r)
			case http.MethodPut:
				handlers.UpdateTransaction(w,r)
			case http.MethodDelete:
				handlers.DeleteTransaction(w,r)
			default:
				http.NotFound(w,r)
			}
			return
		}

		if path == "/"{
			w.Write([]byte("Finance Tracker API"))
			return 
		}

		http.NotFound(w,r)
	})
}