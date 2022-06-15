export let history = []

export default function handler(req, res) {

    if (req.method === "GET") {

        res.status(200).send(history)

    } else if (req.method === "DELETE") {

        history = []
        res.status(200).send(history)

    }

}