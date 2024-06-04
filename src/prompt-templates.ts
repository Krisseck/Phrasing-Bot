// Using KoboldCpp adapter format

export interface promptTemplate {
    system_start: string,
    system_end: string,
    user_start: string,
    user_end: string,
    assistant_start: string,
    assistant_end: string
}

export interface promptTemplateCollection {
    [prompt_key: string]: promptTemplate
}

export default {
    COMMAND_R: {
        system_start: "<|START_OF_TURN_TOKEN|><|SYSTEM_TOKEN|>\n",
        system_end: "<|END_OF_TURN_TOKEN|>\n",
        user_start: "<|START_OF_TURN_TOKEN|><|USER_TOKEN|>\n",
        user_end: "<|END_OF_TURN_TOKEN|>\n",
        assistant_start: "<|START_OF_TURN_TOKEN|><|CHATBOT_TOKEN|>\n",
        assistant_end: "<|END_OF_TURN_TOKEN|>\n",
    },
    LLAMA_3: {
        system_start: "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n",
        system_end: "<|eot_id|>\n",
        user_start: "<|start_header_id|>user<|end_header_id|>\n",
        user_end: "<|eot_id|>\n",
        assistant_start: "<|start_header_id|>assistant<|end_header_id|>\n",
        assistant_end: "<|eot_id|>\n",
    },
    VICUNA: {
        system_start: "",
        system_end: "\n",
        user_start: "USER:\n",
        user_end: "\n",
        assistant_start: "ASSISTANT\n",
        assistant_end: "\n",
    }
} as promptTemplateCollection
