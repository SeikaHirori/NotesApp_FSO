 // Current section: https://arc.net/l/quote/qecvfmvn
import { Note } from './DataModel/Note';
import { Express, NextFunction, Request, Response } from "express";

const express = require('express')
const cors = require('cors')

const app: Express = express()
app.use(cors())
app.use(express.json())

/**
 * Middleware to show static content
 * https://arc.net/l/quote/vwjaaght
 */ 
app.use(express.static('dist'))

let notes: Note[] = [
    {
       id: 1,
       content: "HTML is easy",
       important: true 
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id: number = Number(request.params.id)
    const note: Note | undefined = notes.find(note => {
        console.log(note.id, 
            typeof note.id, 
            id,
            typeof id, 
            note.id === id
        );
        return note.id === id
    })
    if (note) {
        response.json(note) 
    } else {
        // Implementing a custom message for 404 error
        response.statusMessage = `Content id "${id}" doesn't exists`
        response.status(404).end()
    }
})

// Deleting Resources: https://arc.net/l/quote/mrmpvzlr
app.delete('/api/notes/:id', (request, response) => {
    const id: number = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})


const generateId: () => number = () => {
    const maxId: number = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        :0
    return maxId + 1;
}

// Activate JSON-parser for HTTP POST request:
// https://arc.net/l/quote/pjmjzabn
app.post('/api/notes', (request, response) => {
    const body: Note = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note: Note = {
        content: body.content,
        important: Boolean(body.important) || false,
        id: generateId(),
    }

    notes = notes.concat(note)

    console.log(note);
    response.json(note)
})

// Middleware: https://arc.net/l/quote/rzghvdjv
const requestLogger: (request: Request, response: Response, next: NextFunction) => void = (request, response, next) => {
    console.log('Method: ', request.method)
    console.log('Path: ', request.path)
    console.log('Body: ', request.body)
    console.log('---')
    next()
}

app.use(requestLogger)

// Unknown endpoint | catch requests to non-existent routes
// https://arc.net/l/quote/gbirhrky
const unknownEndpoint = (request: Request, response: Response) => {
    response.status(404).send({
        error: 'unknown endpoint'
    })
}
app.use(unknownEndpoint)

/**
 * Port specs for Render
 * https://arc.net/l/quote/mzzwpcmr
 */
const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)