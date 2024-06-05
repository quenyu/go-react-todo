package api

import (
	// "database/sql"
	// "fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	_ "github.com/gofiber/fiber/v2"

	_ "github.com/lib/pq"
)

type Todo struct {
	ID    string `json:"id"`
	Title string `json:"title"`
	Body  string `json:"body"`
	Done  bool   `json:"done"`
}

var todos = []Todo{
	{
		ID:    "1",
		Title: "todo 1",
		Body:  "todo body 1",
		Done:  false,
	},
	{
		ID:    "2",
		Title: "todo 2",
		Body:  "todo body 2",
		Done:  false,
	},
}

// func SetupPostgres() {
// 	connStr := "user=postgres password=postgrespass host=localhost dbname=mydb sslmode=disable"
// 	db, err := sql.Open("postgres", connStr)

// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	if err = db.Ping(); err != nil {
// 		fmt.Println(err.Error())
// 	}
// }

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusOK)
			return
		}

		c.Next()
	}
}

func GetTodos(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, todos)
}

func PostNewTodo(c *gin.Context) {
	var newTodo Todo
	if err := c.BindJSON(&newTodo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Bad request"})
		return
	}

	if len(todos) > 0 {
		lastID, err := strconv.Atoi(todos[len(todos)-1].ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
			return
		}
		newTodo.ID = strconv.Itoa(lastID + 1)
	} else {
		newTodo.ID = "1"
	}

	todos = append(todos, newTodo)

	c.JSON(http.StatusCreated, newTodo)
}


func GetTodoByID(c *gin.Context) {
	id := c.Param("id")
	for _, todo := range todos {
		if todo.ID == id {
			c.IndentedJSON(200, todo)
			return
		}
	}

	c.IndentedJSON(http.StatusNotFound, gin.H{
		"message": "todo not found",
	})
}

func UpdateTodoByID(c *gin.Context) {
	id := c.Param("id")

	for index, todo := range todos {
		if todo.ID == id {
			c.BindJSON(&todo)
			todos[index] = todo
			c.IndentedJSON(http.StatusNoContent, todo)
			return
		}
	}
	c.IndentedJSON(http.StatusNotFound, gin.H{
		"message": "todo not found",
	})
}

func DeleteTodoByID(c *gin.Context) {
	id := c.Param("id")
	for index, todo := range todos {
		if todo.ID == id {
			todos = append(todos[:index], todos[index+1:]...)
			c.IndentedJSON(http.StatusOK, todo)
			return
		}
	}

	c.IndentedJSON(http.StatusNotFound, gin.H{
		"message": "todo not found",
	})
}
