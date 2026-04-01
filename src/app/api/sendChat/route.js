import { db } from "@/lib/config";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();

        const group = body.group;

        let table_name = null;
        let phone_number = null;
        let template_name = null;

        if (group === "Group") {
            table_name = body.table;

            phone_number = [
                9994088081,
                9842138992,
                9941218578,
                6374087299,
                8610319702,
                8681875773,
                8825400255,
                7845618218
            ];

            template_name = body.message;
        } else {
            phone_number = body.to;
            template_name = body.message;
        }

        let text_content = body.text;



        if (!phone_number || !template_name && group !== 'Group') {
            return NextResponse.json(
                { success: false, error: "Phone or template missing" },
                { status: 400 }
            );
        }

        const VERSION = "v22.0";
        // const PHONE_ID = "943145748876197"; // test phone id
        const PHONE_ID = "970215932838693"; // live phone id
        const ACCESS_TOKEN = "EAAQxkECsit8BQg8aEEbgbP56sUCsWFvQxgXiYHHe3X1r36tyC2lRhJ0TICioabumnpqbvcXguKjdzZCA1aJZCOQ3erYHMOJIj8c17OUlMn88Hl03ehdWPIdbXYZBrQZBBRfBaI5V1G13cNDD0jbfeT1LKURVPPSTGFYj8UG3kYuZBKeNC9mNxk981Btl1EgZDZD";

        const languageFormate = {
            hello_world: "en_US",
            republic_clients_wishes: "en",
            republic_offers: "en",
            welcome_new_enquiry: "en"
        };

        const numbers = (Array.isArray(phone_number)
            ? phone_number
            : [phone_number]
        ).map((num) => {
            num = num.toString().trim();
            if (!num.startsWith("91")) {
                num = "91" + num;
            }
            return num;
        });

        let results = [];


        try {
            await db.query("SELECT 1");
            console.log("DB Connected ");
        } catch (err) {
            console.error("DB Connection Failed", err);
        }

        for (let num of numbers) {
            const payload = {
                messaging_product: "whatsapp",
                to: num,
                type: "template",
                template: {
                    name: template_name,
                    language: {
                        code: languageFormate[template_name] || "en_US"
                    },
                    components: []
                }
            };


            switch (template_name) {
                case "republic_clients_wishes":
                    payload.template.components.push({
                        type: "header",
                        parameters: [{
                            type: "image",
                            image: {
                                link: "http://mychennaiscrapbuyers.com/assets/img/service-img/Iron.jpg"
                            }
                        }]
                    });
                    break;

                case "republic_offers":
                    payload.template.components.push({
                        type: "header",
                        parameters: [{
                            type: "image",
                            image: {
                                link: "https://www.mychennaiscrapbuyers.com/assets/img/service-img/Brass.jpg"
                            }
                        }]
                    });
                    break;

                case "welcome_new_enquiry":
                    payload.template.components.push({
                        type: "body",
                        parameters: [{
                            type: "text",
                            text: text_content || "Hello"
                        }]
                    });
                    break;

                case "hello_world":
                    break;

                default:
                    return NextResponse.json(
                        { success: false, error: "Invalid template name" },
                        { status: 400 }
                    );
            }

            console.log("Sending to:", num);


            let waData;
            try {
                const waResponse = await fetch(
                    `https://graph.facebook.com/${VERSION}/${PHONE_ID}/messages`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${ACCESS_TOKEN}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(payload)
                    }
                );

                waData = await waResponse.json();
                console.log("Response:", waData);

                if (!waResponse.ok) {
                    results.push({ num, status: "failed", error: waData });
                    continue;
                }

            } catch (apiErr) {
                console.error("WhatsApp API Error:", apiErr);
                results.push({ num, status: "failed", error: apiErr.message });
                continue;
            }

            const message_id = waData.messages?.[0]?.id || null;
            const conversation_id = waData.contacts?.[0]?.wa_id || null;


            try {
                const query = `
                    INSERT INTO messages
                    (message_id, phone_number, template_name, message_type, message_content, direction, parameters, conversation_id, status)
                    VALUES (?, ?, ?, ?, ?, 'outbound', ?, ?, 'sent')
                `;

                const values = [
                    message_id,
                    num,
                    template_name,
                    "template",
                    template_name,
                    null,
                    conversation_id
                ];

                await db.query(query, values);

            } catch (dbErr) {
                console.error("DB ERROR:", dbErr);

            }

            results.push({ num, status: "sent" });


            await new Promise(res => setTimeout(res, 300));
        }

        return NextResponse.json({
            success: true,
            message: "Process completed",
            total: numbers.length,
            results
        });

    } catch (error) {
        console.error("ERROR:", error);

        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}