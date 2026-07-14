import axios from "axios";

const AI_URL = "http://127.0.0.1:8000";

export async function compareItems(item1, item2) {

    const response = await axios.post(
        `${AI_URL}/compare`,
        {
            item1,
            item2,
        }
    );

    return response.data.similarity;
}