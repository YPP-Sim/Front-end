const patchNotes = [
  {
    title: "Token dusting",
    date: "10/14/2020",
    description:
      "With the semi-release of the game, players have been able to stack tokens which is untraditional of the original battle navigation mechanics. Token dusting has now been introduced into YPP-SIM. After 5 turns of a token generating, that if that token has not been used, it will dust.",
    changeList: [
      "Tokens will now dust if not used for 5 turns after generation",
    ],
  },
  {
    title:
      "Shooting while sinking, taking damage in safezone, and more crash fixes",
    date: "10/13/2020",
    description:
      "Ships will no longer shoot while sinking, damage will also not be applied anymore while sitting in the safezone. A weird bug that crashed the server was also fixed.",
    changeList: [
      "Ships no longer shoot cannons if they're sinking",
      "Tweaked down the jobber quality numbers, primarily cannons per turn from 17 to 12",
      "Ships no longer take damage when in safe zone",
      "Fixed sinking texture bug",
    ],
  },
  {
    title:
      "Hot joining, More Bug fixes, and continuous deployment setup for the server",
    date: "10/12/2020",
    description:
      "Players are now able to join in the middle of a game. More bug fixes and crash fixes to make it more stable. Code deployment on the server has now become automated and easier.",
    changeList: [
      "Added a way for players to join in the middle of a game (via the bottom side box for players who don't yet have a ship in the game)",
      "Fixed crashing bug with the repair generator",
      "Fixed graphical bug when the radius influence visual was offset for other players when new players joined in",
      "Flags no longer have the ocean tile underneath, instead a regular sea game tile",
      "updating game data now changes colors based on team side of client user",
      "Created a box section underneath game for side/ship selection for players who are not yet in but the game has started",
    ],
  },
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
