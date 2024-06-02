package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"log"
	"server/packages/api"
)

func main() {
	app := fiber.New()
	api.SetupPostgres()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
		AllowMethods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
		AllowHeaders: "*",
	}))

	app.Get("/api/todos", api.GetTodos)

	app.Post("/api/todos", api.PostNewTodo)

	app.Patch("/api/todos/:id/done", api.SetToCompletedTodo)

	app.Delete("/api/todos/:id", api.DeleteTodo)

	log.Fatal(app.Listen(":4000"))
}
