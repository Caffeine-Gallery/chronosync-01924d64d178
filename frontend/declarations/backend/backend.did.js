export const idlFactory = ({ IDL }) => {
  const Meeting = IDL.Record({
    'title' : IDL.Text,
    'participants' : IDL.Vec(IDL.Text),
    'date' : IDL.Text,
    'time' : IDL.Text,
    'location' : IDL.Text,
  });
  return IDL.Service({
    'addMeeting' : IDL.Func([IDL.Text, Meeting], [], []),
    'getAllMeetings' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(Meeting)))],
        ['query'],
      ),
    'getMeetings' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(IDL.Vec(Meeting))],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
