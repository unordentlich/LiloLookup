import {Request, Response} from "express";
import {client} from "@core/redis";

export const stats = async (req: Request, res: Response) => {
    let host = req.params.address.split(":")[0].toLowerCase(),
        port = parseInt(req.params.address.split(":")[1]) || 25565,
        result = [];

    const serverStats = JSON.parse(await client.hGet(`server:${host}:${port}`, "stats")),
        size = parseInt(req.query.size as string) || 0;

    if (serverStats && size > serverStats.length)
        return res.status(404).send({"status": 404});
    
    for (let i = 1; i <= size; i++) {
        result.push({
            time: serverStats[serverStats.length - (size + 1) + i].time,
            online: serverStats[serverStats.length - (size + 1) + i].online
        });
    }

    if (port > 65535 || isNaN(port))
        return res.status(404).send({"status": 404});

    if (result)
        return res.send(result);

    return res.status(500).send({"status": 500});
}