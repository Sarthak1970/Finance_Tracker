package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Transaction struct {
	ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Amount      float64           `json:"amount" bson:"amount"`
	Description string            `json:"description" bson:"description"`
	Date        time.Time         `json:"date" bson:"date"`
	Category    string            `json:"category" bson:"category"`
	Type        string            `json:"type" bson:"type"` // "expense" or "income"
	CreatedAt   time.Time         `json:"created_at" bson:"created_at"`
}

type TransactionRequest struct {
	Amount      float64 `json:"amount"`
	Description string  `json:"description"`
	Date        string  `json:"date"`
	Category    string  `json:"category"`
	Type        string  `json:"type"`
}