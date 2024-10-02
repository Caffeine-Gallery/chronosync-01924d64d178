import Hash "mo:base/Hash";

import Array "mo:base/Array";
import Debug "mo:base/Debug";
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
  var meetings = HashMap.fromIter<Text, [Meeting]>(meetingsEntries.vals(), 10, Text.equal, Text.hash);

  public func addMeeting(date : Text, meeting : Meeting) : async () {
    Debug.print("Adding meeting for date: " # date);
    let existingMeetings = switch (meetings.get(date)) {
      case (null) { [] };
      case (?m) { m };
    };
    meetings.put(date, Array.append<Meeting>(existingMeetings, [meeting]));
    Debug.print("Meeting added successfully");
  };

  public query func getMeetings(date : Text) : async ?[Meeting] {
    Debug.print("Getting meetings for date: " # date);
    let result = meetings.get(date);
    switch (result) {
      case (null) { Debug.print("No meetings found for date: " # date); };
      case (?m) { Debug.print("Found " # Nat.toText(m.size()) # " meetings for date: " # date); };
    };
    result
  };

  public query func getAllMeetings() : async [(Text, [Meeting])] {
    Debug.print("Getting all meetings");
    let result = Iter.toArray(meetings.entries());
    Debug.print("Total dates with meetings: " # Nat.toText(result.size()));
    result
  };

  system func preupgrade() {
    meetingsEntries := Iter.toArray(meetings.entries());
    Debug.print("Preupgrade: Stored " # Nat.toText(meetingsEntries.size()) # " meeting entries");
  };

  system func postupgrade() {
    Debug.print("Postupgrade: Restoring " # Nat.toText(meetingsEntries.size()) # " meeting entries");
    meetings := HashMap.fromIter<Text, [Meeting]>(meetingsEntries.vals(), 10, Text.equal, Text.hash);
    meetingsEntries := [];
  };

  // Initialize with sample data
  public func initializeSampleData() : async () {
    Debug.print("Initializing sample data");
    let sampleMeetings : [(Text, [Meeting])] = [
      ("2024-11-02", [
        { date = "Wed, 2 Nov"; time = "10:00 AM - 11:00 AM"; title = "Design Review Meeting"; participants = ["Alice Johnson", "Mark Lee"]; location = "Zoom" },
        { date = "Wed, 2 Nov"; time = "1:00 PM - 2:00 PM"; title = "Sprint Planning"; participants = ["Tom Hanks", "Jessica White"]; location = "Google Meet" }
      ]),
      ("2024-11-06", [
        { date = "Mon, 6 Nov"; time = "10:00 AM - 11:00 AM"; title = "Brainstorming Session"; participants = ["Sara Parker", "Kumail Nanji"]; location = "Zoom" }
      ]),
      ("2024-11-08", [
        { date = "Wed, 8 Nov"; time = "2:00 PM - 3:00 PM"; title = "Strategy Meeting"; participants = ["Robert Green", "David Lee"]; location = "Google Meet" },
        { date = "Wed, 8 Nov"; time = "4:00 PM - 5:00 PM"; title = "Budget Review"; participants = ["Jessica White", "Tom Hanks"]; location = "Microsoft Teams" },
        { date = "Wed, 8 Nov"; time = "5:30 PM - 6:30 PM"; title = "Q&A Session"; participants = ["Bob Smith", "Emma Stone"]; location = "In-person" }
      ]),
      ("2024-11-15", [
        { date = "Wed, 15 Nov"; time = "9:00 AM - 10:00 AM"; title = "Client Feedback Session"; participants = ["Sarah Parker", "Kumail Nanji"]; location = "In-person at Office" }
      ]),
      ("2024-11-17", [
        { date = "Fri, 17 Nov"; time = "9:00 AM - 10:00 AM"; title = "Weekly Standup"; participants = ["David Lee", "Sophia Young"]; location = "Microsoft Teams" },
        { date = "Fri, 17 Nov"; time = "11:00 AM - 12:00 PM"; title = "Client Update"; participants = ["Sara Parker", "Kumail Nanji"]; location = "In-person" },
        { date = "Fri, 17 Nov"; time = "2:00 PM - 3:00 PM"; title = "Feature Demo"; participants = ["Bob Smith", "Emma Stone"]; location = "Zoom" },
        { date = "Fri, 17 Nov"; time = "4:00 PM - 5:00 PM"; title = "Feedback Session"; participants = ["Mark Lee", "Alice Johnson"]; location = "Google Meet" }
      ]),
      ("2024-11-21", [
        { date = "Tue, 21 Nov"; time = "11:00 AM - 12:00 PM"; title = "Product Launch"; participants = ["Alice Johnson", "Mark Lee"]; location = "Zoom" },
        { date = "Tue, 21 Nov"; time = "1:00 PM - 2:00 PM"; title = "Customer Feedback"; participants = ["Sara Parker", "Kumail Nanji"]; location = "Google Meet" },
        { date = "Tue, 21 Nov"; time = "3:00 PM - 4:00 PM"; title = "Design Iteration"; participants = ["David Lee", "Sophia Young"]; location = "In-person" },
        { date = "Tue, 21 Nov"; time = "5:00 PM - 6:00 PM"; title = "Team Celebration"; participants = ["Bob Smith", "Jessica White"]; location = "Office Rooftop" },
        { date = "Tue, 21 Nov"; time = "7:00 PM - 8:00 PM"; title = "Happy Hour"; participants = ["Tom Hanks", "Emma Stone"]; location = "Local Bar" }
      ]),
      ("2024-11-30", [
        { date = "Thu, 30 Nov"; time = "11:00 AM - 12:00 PM"; title = "Brainstorming Session"; participants = ["David Lee", "Sophia Young"]; location = "Zoom" }
      ])
    ];

    for ((date, dayMeetings) in sampleMeetings.vals()) {
      for (meeting in dayMeetings.vals()) {
        await addMeeting(date, meeting);
      };
    };
    Debug.print("Sample data initialized");
  };
}
