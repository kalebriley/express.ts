import { IncomingMessage, ServerResponse } from 'http'

const users: string[] = ['Kaleb']

export const routes = (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url
    const method = req.method
    if (url === '/') {
        handleHome(req, res)
    }

    if (url === '/users') {
        handleUsers(req, res)
    }

    if (url === '/create-user' && method === 'POST') {
        handleCreateUser(req, res)
    }
}

const handleCreateUser = (req: IncomingMessage, res: ServerResponse) => {
    const body: Uint8Array[] = []
    req.on('data', (chunk) => {
        body.push(chunk)
    })
    return req.on('end', () => {
        const bodyString = Buffer.concat(body).toString()
        const user = bodyString.split('=')[1]
        users.push(user)
        res.statusCode = 302
        res.setHeader('Location', '/users')
        res.end()
    })
}

const handleHome =  (req: IncomingMessage, res: ServerResponse) => {
    createHTML(
        req, 
        res, 
        [
            '<p>Hello World</p>',
            '<form method="POST" action="/create-user"><input type="text" name="user"><button type="submit">Submit</button></form>'
        ]
    )
    res.end()
}

const handleUsers = (req: IncomingMessage, res: ServerResponse) => {
    const newUsers = users.map( user => {
        return `<li>${user}</li>`
    })
    const newUsersList = ['<ul>', ...newUsers, '</ul>']
    createHTML(req, res, newUsersList)
    res.end()
}

const createHTML = (req: IncomingMessage, res: ServerResponse, htmlArray: string[]) => {
        res.write('<html>')
        res.write('<body>')
        for (const html of htmlArray) {
            res.write(html)
        }
        res.write('</body>')
        res.write('</html>')
}