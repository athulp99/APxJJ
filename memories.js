// Each note belongs to a keepsake or to the back of a specific print.
function print(file, width, height, caption, alt) {
  return { file, width, height, caption, alt };
}

function photos(period, ...prints) {
  return { period, prints };
}

function note(period, body, options = {}) {
  return { period, body, ...options };
}

export const memories = [
  { ...photos("August 2025", print("first-date-snapchat.png", 1179, 2556, "26 August · making a plan", "Our Snapchat conversation arranging our first date.")), object: "firsts" },
  { ...photos("August 2025", print("after-first-date.jpeg", 1242, 2208, "Before we met", "The group chat announcement before our first date.")), object: "firsts" },
  { ...photos("August 2025", print("first-imessage.png", 1179, 2556, "27 August · your first iMessage", "Jeny introduces herself by text after our first date.")), object: "firsts" },
  note("August 2025", "Scammers getting creative nowadays", { backOf: "first-imessage.png" }),
  note("August 2025", "You used to send me all the fit checks from day 1 and I loved watching all of them but you got annoyed because I didn’t reply so you were like why am I sending this to you if you don’t care but I did care and I said I’ll try harder to reply but it didn’t get much better but you learnt to live with it anyway.", { object: "fit", fold: "Your fit checks" }),
  note("My birthday", "You gave me so many presents for my birthday,", { object: "receipt" }),
  note("My birthday", "and you tried my cookie - idk if you were being honest fully or just saying to not hurt me but you said you loved them and took it home and shared it .", { object: "receipt" }),
  note("My birthday", "You actually came to see me for my birthday and we got Krispy Kreme donuts together cos I had too good to go .", { object: "receipt" }),
  note("My birthday", "We became exclusive when we hung out for an entire day for my birthday , we went to Swiss butter , you bought smiskis and then at nq64 you said accused me of being an FBOI .\n\n(Allegedly)", { object: "receipt" }),
  note("November 2025", "‘be mine’", { object: "anniversary", fold: "7 November 2025" }),
  photos("December 2025", print("winter-fair.jpg", 360, 480, "19 December · the fair", "The two of us by the fairground lights, Jeny in a red scarf.")),
  note("December 2025", "You met my friends , and I met your friends we eventually started being so comfortable around each others lives, and that’s when our lives began feeling like our lives were actually beginning to intertwine", { backOf: "december-friends.jpg" }),
  photos("December 2025", print("december-friends.jpg", 360, 480, "The following evening", "Everyone gathered together outside Quadrant Arcade.")),
  photos("February 2026", print("february-selfie.jpg", 360, 480, "25 February", "Our close-up selfie under bare branches.")),
  note("March 2026", "Then we went o Nottingham in march !", { object: "letters" }),
  photos("March 2026", print("leaderboard.jpg", 310, 552, "Our names on the board", "Our names highlighted together on the arcade leaderboard.")),
  photos("March 2026", print("lift-selfie.jpg", 360, 480, "25 March · lift mirror", "A lift mirror selfie, wrapped up in our puffer jackets.")),
  photos("April 2026", print("birthday-dessert.jpg", 552, 310, "Your birthday in April!", "A birthday plate with a single lit candle and little desserts.")),
  photos("April 2026", print("fairgame-strip.jpg", 310, 552, "Four frames at FAIRGAME", "Four playful portraits of us on a FAIRGAME photostrip.")),
  photos("May 2026", print("six-months.jpg", 310, 552, "6 months versary in may 7th!", "Our hands together while sitting in the park.")),
  { ...photos("May 2026",
    print("picnic-blanket.jpg", 552, 310, "The picnic blanket", "Jeny on our picnic blanket with snacks and craft supplies."),
    print("picnic-creatures.jpg", 310, 552, "Our little creatures", "Two painted figures, a pink creature and a little orange fox."),
    print("picnic-portrait.jpg", 360, 480, "Your view of me", "A close-up looking down at me on the blanket.")
  ), title: "29 May · on the picnic blanket" },
  note("June 2026", "I moved to seven kings at the end of June and life has been moving so fast for us ever since and I’ve loved every second of it. I love seeing you so often . Its is genuinely the best part of my week . Going into office and a role that makes me do that 4 times a week is bearable because of you !", { object: "letters" }),
  photos("July 2026", print("july-park.jpg", 310, 552, "4 July", "Jeny crossing a sunlit playing field.")),
  photos("July 2026", print("july-arms.jpg", 360, 480, "8 July", "Our outstretched arms side by side in the evening light.")),
  note("August 2026", "We told each others parents in august !", { backOf: "august-walk.jpg" }),
  photos("August 2026", print("august-walk.jpg", 360, 480, "An August evening", "A playful selfie on the path with friends in the background.")),
  note("October 2026", "And after many more dates we became way too comfortable with each other , well idk about you but I certainly did because I started acting wayyy too goofyy with you .", { backOf: "sheet-masks.jpg" }),
  photos("October 2026", print("sheet-masks.jpg", 480, 360, "9 October", "The two of us in sheet masks, sitting together.")),
  photos("October 2026", print("autumn-portrait.jpg", 540, 360, "10 October", "Us smiling at the camera on a wooded path.")),
  photos("October 2026", print("halloween-ears.jpg", 768, 1024, "31 October", "Rabbit ears and fox ears on Halloween.")),
  { ...photos("Loose prints",
    print("video-call.jpg", 360, 778, "On the other end", "Jeny smiling in the corner of our video call."),
    print("dinner.jpg", 768, 1024, "Across the table", "Us looking at each other in a red-lit restaurant."),
    print("quiz-box.jpg", 1182, 665, "APJJ ♡", "Our Quiz Box team portrait marked with a crown."),
    print("escape-room.jpg", 886, 886, "Last seen together", "Our group on the Mission Breakout souvenir poster."),
    print("proof.jpg", 665, 1182, "Proof before u ask x", "Jeny’s mirror selfie with the caption about proof."),
    print("duck-painting.jpg", 665, 1182, "Almost as valuable as my Warwick degree", "The yellow duck painting displayed beside the framed degree.")
  ), title: "A pocket of loose prints" },
  note("Loose prints", "If I kept your for the past year without losing you , we’ve had our ups and downs. I truly tried to push it to the extreme with my views - they’re a bit extreme but looks like you’re all good with it so 😈. On a real , thank you for allowing me the space to express myself, I know we’re on the opposite sides for most of it but I love that we can discuss those things without it affecting our relationship. I think that was the biggest factor for me to look out for and that’s also my biggest red flag. Thank you for taking the reddest flag and painting it yellow. I love arguing with you jeny and then making up with you after even more.", { object: "letters", fold: "From red to yellow" }),
  note("November 2026", "After this past year, I’d be broken if you’re not by my side for the years to come - that’s all I know.", { object: "anniversary" }),
  note("November 2026", "And that brings us to today , a year went by so quick, I have treasured every moment with you and I will treasure every moment with you going forwards because you make me come alive . I love you Jeny ,\n‘be mine’ for another year ?", { object: "anniversary", title: "7 November 2026", letter: true })
];
