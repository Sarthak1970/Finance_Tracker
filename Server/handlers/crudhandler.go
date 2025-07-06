package handlers

import (
	"context"
	"encoding/json"
	"io/ioutil"
	//"log"
    "strconv"
	"net/http"
	"time"

	"server/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var transactionCollection *mongo.Collection

func InitTransactionHandler(col *mongo.Collection){
	transactionCollection = col
}

func CreateTransaction(w http.ResponseWriter, r *http.Request) {
    var req models.TransactionRequest
    body, err := ioutil.ReadAll(r.Body)
    if err != nil {
        http.Error(w, "Invalid request", http.StatusBadRequest)
        return
    }

    if err := json.Unmarshal(body, &req); err != nil {
        http.Error(w, "Invalid JSON", http.StatusBadRequest)
        return
    }

    parsedDate, err := time.Parse("2006-01-02", req.Date)
    if err != nil {
        http.Error(w, "Invalid date format. Use YYYY-MM-DD", http.StatusBadRequest)
        return
    }

    transaction := models.Transaction{
        ID:          primitive.NewObjectID(),
        Amount:      req.Amount,
        Description: req.Description,
        Date:        parsedDate,
        Category:    req.Category,
        Type:        req.Type,
        CreatedAt:   time.Now(),
    }

    _, err = transactionCollection.InsertOne(context.TODO(), transaction)
    if err != nil {
        http.Error(w, "Failed to insert", http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(transaction)
}

func GetTransactions(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")

    // Parse query parameters
    month := r.URL.Query().Get("month") // format: "07"
    year := r.URL.Query().Get("year")   // format: "2025"

    filter := bson.M{}

    // If both month and year are provided, filter by date
    if month != "" && year != "" {
        yearInt, yErr := strconv.Atoi(year)
        monthInt, mErr := strconv.Atoi(month)
        if yErr != nil || mErr != nil || monthInt < 1 || monthInt > 12 {
            http.Error(w, "Invalid month or year", http.StatusBadRequest)
            return
        }

        // Build date range: from 1st to last day of month
        startDate := time.Date(yearInt, time.Month(monthInt), 1, 0, 0, 0, 0, time.UTC)
        endDate := startDate.AddDate(0, 1, 0) // first day of next month

        filter = bson.M{
            "date": bson.M{
                "$gte": startDate,
                "$lt":  endDate,
            },
        }
    }

    cursor, err := transactionCollection.Find(context.TODO(), filter)
    if err != nil {
        http.Error(w, "Failed to fetch transactions", http.StatusInternalServerError)
        return
    }
    defer cursor.Close(context.TODO())

    var transactions []models.Transaction
    if err := cursor.All(context.TODO(), &transactions); err != nil {
        http.Error(w, "Failed to decode transactions", http.StatusInternalServerError)
        return
    }

    if len(transactions) == 0 {
        json.NewEncoder(w).Encode(map[string]string{
            "message": "No transactions found",
        })
        return
    }

    json.NewEncoder(w).Encode(transactions)
}


func UpdateTransaction(w http.ResponseWriter, r *http.Request) {
    id := r.URL.Query().Get("id")
    objID, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        http.Error(w, "Invalid ID", http.StatusBadRequest)
        return
    }

    var req models.TransactionRequest
    body, err := ioutil.ReadAll(r.Body)
    if err != nil {
        http.Error(w, "Invalid request", http.StatusBadRequest)
        return
    }

    if err := json.Unmarshal(body, &req); err != nil {
        http.Error(w, "Invalid JSON", http.StatusBadRequest)
        return
    }

    parsedDate, err := time.Parse("2006-01-02", req.Date)
    if err != nil {
        http.Error(w, "Invalid date format", http.StatusBadRequest)
        return
    }

    update := bson.M{
        "$set": bson.M{
            "amount":      req.Amount,
            "description": req.Description,
            "date":        parsedDate,
            "category":    req.Category,
            "type":        req.Type,
        },
    }

    _, err = transactionCollection.UpdateByID(context.TODO(), objID, update)
    if err != nil {
        http.Error(w, "Failed to update", http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
    w.Write([]byte(`{"message": "Updated successfully"}`))
}

func DeleteTransaction(w http.ResponseWriter, r *http.Request) {
    id := r.URL.Query().Get("id")
    objID, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        http.Error(w, "Invalid ID", http.StatusBadRequest)
        return
    }

    _, err = transactionCollection.DeleteOne(context.TODO(), bson.M{"_id": objID})
    if err != nil {
        http.Error(w, "Failed to delete", http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
    w.Write([]byte(`{"message": "Deleted successfully"}`))
}
