package main

import (
	"regexp"
	"github.com/gin-gonic/gin"
)

var idRegex = regexp.MustCompile("^[a-f0-9]{64}$")
var itemRegex = regexp.MustCompile("^[a-zA-Z0-9]+$")

func main() {
	r := gin.Default()

	r.GET("/storage/check", func(c *gin.Context) {
		items := map[string]int{
			"jacket":      2,
			"sunglasses":  2,
			"sandevistan": 1,
		}

		c.JSON(200, items)
	})

	r.POST("/storage/send", func(c *gin.Context) {
		// Assume authorization and authentication are properly managed
		origin := c.GetHeader("Origin")

		if origin == "" {
			c.JSON(403, gin.H{"error": "Forbidden"})
			return
		}

		r, _ := regexp.Compile(".*\\.nc.storage")
		matchedString := r.MatchString(origin)

		if matchedString {
			c.Header("Access-Control-Allow-Origin", origin)
			c.Header("Access-Control-Allow-Credentials", "true")
		} else if origin == "null" {
			c.Header("Access-Control-Allow-Origin", "null")
			c.Header("Access-Control-Allow-Credentials", "true")
		} else {
			c.JSON(403, gin.H{"error": "Forbidden"})
			return
		}

		itemName := c.PostForm("item_name")
		if itemName == "" {
			c.JSON(400, gin.H{"error": "item_name required"})
			return
		}
		if !itemRegex.MatchString(itemName) {
			c.JSON(400, gin.H{"error": "invalid item_name"})
			return
		}

		recipientID := c.PostForm("recipient_id")
		if recipientID == "" {
			c.JSON(400, gin.H{"error": "recipient_id required"})
			return
		}
		if !idRegex.MatchString(recipientID) {
			c.JSON(400, gin.H{"error": "invalid recipient_id"})
			return
		}

		c.JSON(200, gin.H{"message": itemName + " sent successfully"})
	})

	r.Run(":1337")
}