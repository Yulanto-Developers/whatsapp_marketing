// import { initIO } from "@/lib/socket";

// export async function GET() {
//     if (!global.ioInitialized) {
//         global.ioInitialized = true;
//         initIO();
//     }
//     return new Response("Socket initialized");
// }

import { initIO } from "@/lib/socket";

export async function GET() {
    console.log("⚡ Initializing Socket Server");
    initIO();
    return new Response("Socket initialized");
}
