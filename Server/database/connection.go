package database

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var DB *mongo.Database

func Connect() {

	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI=="" {
		log.Println("URI not found in env file")
	}

	client,err := mongo.Connect(context.TODO(),options.Client().ApplyURI(mongoURI))
	if err != nil{
		log.Fatal("failed to connect to database :",err)
	}

	ctx,cancel := context.WithTimeout(context.Background(),10*time.Second)
	defer cancel()

	err = client.Ping(ctx,nil)
	if err != nil{
		log.Fatal("Failed to ping mongoDB: ",err)
	}

	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "Conferencing"
	}

	DB = client.Database((dbName))
	log.Println("Successfully connected to MongoDB")
}