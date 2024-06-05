package main

import (
	"log"
	"server/packages/api"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.Use(api.CORSMiddleware())

	router.GET("/api/todos", api.GetTodos)
	router.GET("/api/todos/:id", api.GetTodoByID)
	router.POST("/api/todos", api.PostNewTodo)
	router.PUT("/api/todos/:id", api.UpdateTodoByID)
	router.DELETE("/api/todos/:id", api.DeleteTodoByID)

	log.Fatal(router.Run(":4000"))
}
