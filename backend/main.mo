import Hash "mo:base/Hash";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

actor {
  type Meeting = {
    date : Text;
    time : Text;
    title : Text;
    participants : [Text];
    location : Text;
  };

  stable var meetingsEntries : [(Text, [Meeting])] = [];
  let meetings = HashMap.fromIter<Text, [Meeting]>(meetingsEntries.vals(), 10, Text.equal, Text.hash);

  public func addMeeting(date : Text, meeting : Meeting) : async () {
    let existingMeetings = switch (meetings.get(date)) {
      case (null) { [] };
      case (?m) { m };
    };
    meetings.put(date, Array.append<Meeting>(existingMeetings, [meeting]));
  };

  public query func getMeetings(date : Text) : async ?[Meeting] {
    meetings.get(date)
  };

  public query func getAllMeetings() : async [(Text, [Meeting])] {
    Iter.toArray(meetings.entries())
  };

  system func preupgrade() {
    meetingsEntries := Iter.toArray(meetings.entries());
  };

  system func postupgrade() {
    meetingsEntries := [];
  };
}
