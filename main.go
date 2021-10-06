package main

import (
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"gographer/gographer"
)

// Make random changes to graph
func makeRandomChanges(g *gographer.Graph) {
	nodesToBeRemoved := 2
	nodesToBeAdded := 5

	for {
		numNodes := g.GetNumberOfNodes()

		// Remove some nodes
		for i := 0; i < nodesToBeRemoved; i++ {
			id := rand.Intn(numNodes)
			g.RemoveNode(id)
			time.Sleep(500 * time.Millisecond)
		}

		// Add some more nodes and edges
		for i := 0; i < nodesToBeAdded; i++ {
			id := rand.Intn(numNodes)
			g.AddNode(id, "node "+strconv.Itoa(id), id, 1)
			g.AddEdge(id, rand.Intn(numNodes), id, 1)
			time.Sleep(500 * time.Millisecond)
		}

		//time.Sleep(1000 * time.Millisecond)
	}
}

func main() {
	g := gographer.New()

	rand.Seed(time.Now().UTC().UnixNano())
	numNodes := 10
	for i := 0; i < numNodes; i++ {
		id := rand.Intn(numNodes)
		g.AddNode(id, "node "+strconv.Itoa(id), id, 1)
		g.AddEdge(id, rand.Intn(numNodes), id, 1)
	}

	//gopath := os.Getenv("GOPATH")
	//rootServeDir := gopath + "/src/fjukstad/gographer/root_serve_dir/"
	rootServeDir := "./root_serve/"

	go makeRandomChanges(g)

	log.Println("Graph created, go visit at localhost:8080")

	panic(http.ListenAndServe(":8080", http.FileServer(http.Dir(rootServeDir))))
}
