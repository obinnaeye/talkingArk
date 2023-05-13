import {
    DocumentDefinition,
    FilterQuery,
    UpdateQuery,
    QueryOptions,
} from "mongoose";
import Talk, { TalkDocument } from "../model/talk.model";
import TalkAttendee, { TalkAttendeeDocument } from "../model/talkAttendee.model";

export function createTalk(input: DocumentDefinition<TalkDocument>): any {
    return Talk.create(input);
}

export function findTalk(
    query: FilterQuery<TalkDocument>,
    options: QueryOptions = { lean: true }
) {
    return Talk.findOne(query, {}, options);
}

export function findTalks(
    query: FilterQuery<TalkDocument>
) {
    return Talk.find(query);
}

export function findAndUpdate(
    query: FilterQuery<TalkDocument>,
    update: UpdateQuery<TalkDocument>,
    options: QueryOptions
) {
    return Talk.findOneAndUpdate(query, update, options);
}

export function deleteTalk(query: FilterQuery<TalkDocument>) {
    return Talk.deleteOne(query);
}

export function addAttendeeToTalk(input: { talk: string, attendee: string}) {
    return TalkAttendee.create(input);
}

export function findTalkAttendees(
    query: FilterQuery<TalkAttendeeDocument>
) {
    return TalkAttendee.find(query);
}
