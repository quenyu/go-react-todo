package api

import (
	"database/sql"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"log"
	"strconv"

	_ "github.com/lib/pq"
)

type TODO struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
	Done  bool   `json:"done"`
	Body  string `json:"body"`
}

var todos []TODO

//	func StartServer() *fiber.App {
//		app := fiber.New()
//
//		app.Use(cors.New(cors.Config{
//			AllowOrigins: "http://localhost:3000",
//			AllowMethods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
//			AllowHeaders: "*",
//		}))
//
//		log.Fatal(app.Listen(":4000"))
//
//		return app
//	}
var db *sql.DB
var err error

func SetupPostgres() {
	connStr := "user=pqgotest dbname=pqgotest sslmode=verify-full"
	db, err := sql.Open("postgres", connStr)

	if err != nil {
		log.Fatal(err)
	}

	if err = db.Ping(); err != nil {
		fmt.Println(err.Error())
	}
}

func GetTodos(c *fiber.Ctx) error {
	return c.JSON(todos)
}

func PostNewTodo(c *fiber.Ctx) error {
	todo := new(TODO)
	if err := c.BodyParser(todo); err != nil {
		return err
	}
	todo.ID = len(todos) + 1
	todos = append(todos, *todo)
	return c.JSON(todos)
}

func SetToCompletedTodo(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(401).SendString("Invalid ID")
	}
	for i, todo := range todos {
		if todo.ID == id {
			todos[i].Done = true
			break
		}
	}
	return c.JSON(todos)
}

func DeleteTodo(c *fiber.Ctx) error {
	id := c.Params("id")
	todoID, err := strconv.Atoi(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid ID",
		})
	}

	for i, todo := range todos {
		if todo.ID == todoID {
			// Remove the todo from the slice
			todos = append(todos[:i], todos[i+1:]...)
			break
		}
	}
	return c.JSON(todos)
}
