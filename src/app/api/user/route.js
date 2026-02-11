import { db } from "@/lib/config";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const [data] = await db.query(`SELECT 
  MAX(m.id) AS id,
  COALESCE(m.contact_name, l.name) AS contact_name,
  m.phone_number,
  MAX(m.sent_at) AS sent_at,
  SUBSTRING_INDEX(
    GROUP_CONCAT(m.message_content ORDER BY m.sent_at DESC),
    ',', 1
  ) AS last_message
FROM messages m
LEFT JOIN leads_details l
  ON REPLACE(l.phone, '+', '') = m.phone_number
GROUP BY m.phone_number
ORDER BY MAX(m.sent_at) DESC
`);

        // console.log(data);

        return NextResponse.json({
            status: 200,
            message: data
        });
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: error
        });
    }
}


export async function POST(req) {
    const request = await req.json();
    // console.log("id is "+request.id);
    if (!request.num) {
        return NextResponse.json(
            { status: 400, message: "Phone number required" },
            { status: 400 }
        );
    }
    const [chatSql] = await db.query(`SELECT COALESCE(m.contact_name,l.name) as person_name,m.message_content as message_content,m.direction as direction,m.sent_at as sent_at from messages m 
        left join leads_details l
        on m.phone_number=l.phone
        where m.phone_number=?
        order by m.sent_at asc`, [request.num])
    // console.log(chatSql);
    return NextResponse.json({
        status: 200,
        message: chatSql
    });

}
