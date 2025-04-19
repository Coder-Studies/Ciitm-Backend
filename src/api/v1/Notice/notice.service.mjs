import Notice from "./notice.model.mjs";

class Notice_Service {

    create_Notice = async (data) => {
        let { title, content, doc_link, type } = data;
        let Created_Notice = await Notice.create({
            title,
            content,
            doc_link,
            type,
        });

        if (!Created_Notice) {
           throw new Error("Failed to create notice");
        }

        return Created_Notice;
    }
}

export default new Notice_Service();