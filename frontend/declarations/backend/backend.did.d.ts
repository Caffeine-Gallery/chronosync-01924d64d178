import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Meeting {
  'title' : string,
  'participants' : Array<string>,
  'date' : string,
  'time' : string,
  'location' : string,
}
export interface _SERVICE {
  'addMeeting' : ActorMethod<[string, Meeting], undefined>,
  'getAllMeetings' : ActorMethod<[], Array<[string, Array<Meeting>]>>,
  'getMeetings' : ActorMethod<[string], [] | [Array<Meeting>]>,
  'initializeSampleData' : ActorMethod<[], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
