import { db } from "@/lib/config";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();

        const phone_number = body.to;
        const message_content = body.message;

        const VERSION = "v22.0";
        const PHONE_ID = "943145748876197"; // test phone id
        // const PHONE_ID = "970215932838693"; // live phone id
        const ACCESS_TOKEN = "EAAQxkECsit8BQg8aEEbgbP56sUCsWFvQxgXiYHHe3X1r36tyC2lRhJ0TICioabumnpqbvcXguKjdzZCA1aJZCOQ3erYHMOJIj8c17OUlMn88Hl03ehdWPIdbXYZBrQZBBRfBaI5V1G13cNDD0jbfeT1LKURVPPSTGFYj8UG3kYuZBKeNC9mNxk981Btl1EgZDZD";


        const waResponse = await fetch(
            `https://graph.facebook.com/${VERSION}/${PHONE_ID}/messages`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    to: phone_number,
                    type: "text",
                    text: {
                        body: message_content,
                    },
                }),
            }
        );

        const waData = await waResponse.json();

        console.log(waData);

        if (!waResponse.ok) {
            return NextResponse.json(
                { success: false, error: waData },
                { status: 400 }
            );
        }


        const message_id = waData.messages?.[0]?.id || null;
        const conversation_id = waData.contacts?.[0]?.wa_id || null;


        const query = `
      INSERT INTO messages
      (message_id, phone_number, template_name, message_type, message_content, direction, parameters, conversation_id, status)
      VALUES (?, ?, ?, ?, ?, 'outbound', ?, ?, 'sent')
    `;

        const values = [
            message_id,
            phone_number,
            null,
            "text",
            message_content,
            null,
            conversation_id,
        ];

        await db.query(query, values);

        return NextResponse.json({
            status: true,
            message: "Message sent & stored successfully",
            whatsapp: waData,
        });

    } catch (error) {
        console.error("ERROR:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
