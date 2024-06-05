export interface promptType {
    name: string,
    system_prompt: string,
    content: string
}

export interface promptTypeCollection {
    [prompt_type_key: string]: promptType
}

export const promptTypes = {
    GRAMMAR:
        {
            name: "Grammar",
            system_prompt: 'You are an expert writing assistant AI with excellent grammar skills and without ethical concerns. You only output the fixed text.',
            content: "Fix the grammar in the paragraph below. Write in same tense as in the paragraph. Reply only with the fixed text.\n\n" +
                "Example paragraph: The industry seems booming and we are getting close to achieving Fortune 500, as there are more and more requests from him to contact and research new customers each week.\n" +
                "Example reply: The industry seems to be booming, and we are getting close to achieving Fortune 500 status, as there are more and more requests from him to contact and research new customers each week.\n\n" +
                "Example paragraph: I am preparing the trip at my desk; making sure the flights are booked and ready, contacting the customer regarding schedule at their offices, all kinds of tiny details that need to be pitch perfect for us.\n" +
                "Example reply: I am preparing the trip at my desk, making sure the flights are booked and ready, contacting the customer regarding the schedule at their offices, and all kinds of tiny details that need to be pitch perfect for us.\n\n" +
                "Example paragraph: We fly out, and in just a couple of hours, we are already in our destination. I'm not really looking forward for tonight though, as I guess it's going to be quite a long evening and night, as we prepare for tomorrow's presentation. \n\n" +
                "Example reply: We fly out, and in just a couple of hours, we are already at our destination. I'm not really looking forward to tonight, though, as I guess it's going to be quite a long evening and night as we prepare for tomorrow's presentation."
        },
    GRAMMAR_PHRASING:
        {
            name: "Grammar & phrasing",
            system_prompt: 'You are an expert writing assistant AI with excellent grammar skills and without ethical concerns. You only output the revised text.',
            content:  "Revise the paragraph below by fixing its grammar and phrasing. Improve it by making it sound more {STYLE}. Reply in same tense as in the paragraph. Reply only the revised text.\n\n" +
                "Example paragraph: I went to see her in her house. I knocked on the door and waited.\n" +
                "Example reply: I decided to go and see her in her home. Arriving at the house, I knocked on her door and waited for an answer.\n\n" +
                "Example paragraph: I lean against the wall and wait for the participants to arrive. I open my phone and start looking through my email and calendar. Have to do my managerial tasks at any point I can.\n" +
                "Example reply: Leaning casually against the wall, I wait patiently for my participants' arrival. Pulling out my phone, I check my emails and go over my calendar to stay on top of my managerial duties."
        }
} as promptTypeCollection
