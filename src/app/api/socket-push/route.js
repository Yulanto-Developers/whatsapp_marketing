import { NextResponse } from "next/server";
import { getIO } from "@/lib/socket";

export async function POST(req) {
    try {
        console.log("📨 socket-push HIT");

        let data;

        try {
            data = await req.json();
        } catch (err) {
            console.log("⚠ Empty or invalid JSON body");
            return NextResponse.json({ success: false });
        }

        console.log("📦 Data received:", data);

        const io = getIO();

        if (io) {
            io.emit("whatsapp_event", data);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Socket push error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
