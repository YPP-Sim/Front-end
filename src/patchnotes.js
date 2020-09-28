const patchNotes = [
  {
    title: "Whirlwinds, Bug fixes, Code refactor",
    date: "9/28/20",
    description:
      "This patch introduces now functional whirlpools, user experience improvements, bug fixes, and refactored code so that it's cleaner to read and use.",
    changeList: [
      "Pressing enter key on join form fields now 'presses' the join button as well",
      "Cleaned up memory leaks",
      "Rehauled socket events code (primarily front-end, will be working on back-end rehaul/organization for events)",
      "Fixed wbSinking texture bug",
      "Added interface for game finished events (will implement a visual display of who won in the next patches)",
      "Changed the info display from the top right corner to the top left",
      "Made angular movement code (ship turning, arc paths) cleaner and more easily reusable",
      "Whirlpools now functionally work",
      "Whirlpools now also change the orientation of the ship graphically (bug fix)",
      "Fixed tmer bug where timers would still go after removing a game",
      "Points will no longer be awarded once timer is finished (although plays can still move)",
    ],
  },
  {
    title: "Initial Patch",
    date: "9/24/20",
    description:
      "The first initial patch release that has all basic battle navigation features and common lobby setup features and security.",
    changeList: [
      "Lobby feature system",
      "Chat system",
      "Lobby security using passwords",
      "Ship movement",
      "Token generation",
      "Bilge generation",
      "damage/bilge repair",
      "1-3 point flags implemented",
      "Flag capturing/contesting ",
    ],
  },
];

export default patchNotes;
