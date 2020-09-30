const patchNotes = [
  {
    title: "Small Rocks, New Maps, Influence Circle, and More",
    date: "9/30/20",
    description:
      "From the introduction of small rocks (rocks that you can shoot through) to new map additions based off of real Y!PP blockade maps. The influence circle of ships has been added and can now be seen by hovering over any ship to see all ship influences. Improved animations for the ship and some small user experience fixes have also been added. A bug where a ship was moving forward into another ship that was firing would not collide correctly. Also fixed the bug where the damage/bilge UI were not updating after being sunk",
    changeList: [
      "Added radio buttons above tokens display.",
      "Added influence circle visualization in game",
      "Added all small rock sprites",
      "Small rocks now added and function as intended",
      "Improved ramming animation for turns",
      "Text from some buttons/navigation bar will no longer be highlighted/selected (an annoyance in game when clicking/double clicking)",
      "Ram damage now applied to ships after being pushed into rocks by wind",
      "Damage/Bilge UI now correctly resets/shows and updates on the client after sinking",
      "Fixed collision bug when another ship is stationary and firing",
      "Added new map: Ambush_Round_1",
    ],
  },
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
      "Fixed timer bug where timers would still go after removing a game",
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
