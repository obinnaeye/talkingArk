import { Request, Response } from "express";
import { get } from "lodash";
import {
    createTalk,
    findTalk,
    findAndUpdate,
    deleteTalk,
    findTalks,
    addAttendeeToTalk,
    findTalkAttendees,
} from "../service/talk.service";

export async function createTalkHandler(req: Request, res: Response) {
    const body = req.body;
    const talk = await createTalk(body);

    return res.send(talk);
}

export async function updateTalkHandler(req: Request, res: Response) {
    const talkId = get(req, "params.talkId");
    const update = req.body;
    const talk = await findTalk({ talkId });

    if (!talk) {
        return res.sendStatus(404);
    }

    const updatedTalk = await findAndUpdate({ talkId }, update, { new: true });

    return res.send(updatedTalk);
}

export async function getTalksHandler(req: Request, res: Response) {
    const talks = await findTalks(req.query || {});

    return res.send(talks);
}

export async function getTalkByIdHandler(req: Request, res: Response) {
    const talkId = get(req, "params.talkId");
    const talk = await findTalk({ talkId });

    if (!talk) {
        return res.sendStatus(404);
    }

    return res.send(talk);
}

export async function deleteTalkHandler(req: Request, res: Response) {
    const talkId = get(req, "params.talkId");
    const talk = await findTalk({ talkId });

    if (!talk) {
        return res.sendStatus(404);
    }

    await deleteTalk({ talkId });

    return res.sendStatus(200);
}

export async function addAttendeeToTalkHandler(req: Request, res: Response) {
    const talkId = get(req, "params.talkId");
    const attendeeId = get(req, "params.attendeeId");
    const talkAttendee = await addAttendeeToTalk({ talk: talkId, attendee: attendeeId });

    return res.send(talkAttendee);
}

export async function getTalkAttendeesHandler(req: Request, res: Response) {
    const talkAttendees = await findTalkAttendees(req.query || {});

    return res.send(talkAttendees);
}
