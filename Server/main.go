package main

import (
	"log"
	"net/http"
	"server/database"
	"server/handlers"
	"server/routes"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
)

var Client *mongo.Client

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin","*")
		w.Header().Set("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers","Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w,r)
	})
}

func main(){
	err := godotenv.Load()
	if err != nil {
		log.Println("Env file not found")
	}
	database.Connect()
	handlers.InitTransactionHandler(database.DB.Collection("transactions"))

	r := routes.InitRouter()
	rWithCORS := corsMiddleware(r)

	http.ListenAndServe(":8080",rWithCORS)
	
}